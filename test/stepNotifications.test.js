/* eslint-env node */
const assert = require("node:assert/strict");
const test = require("node:test");

require("sucrase/register/ts");

const {
  evaluateStepNotification,
} = require("../services/stepNotificationEngine.ts");
const {
  buildStepNotificationContent,
} = require("../services/stepNotificationText.ts");

const makeDate = (hour, minute = 0) => new Date(2026, 4, 15, hour, minute, 0);

test("sends a progress notification for the highest unsent milestone", () => {
  const candidate = evaluateStepNotification(
    {
      now: makeDate(13, 15),
      goalSteps: 10000,
      currentSteps: 5000,
    },
    [],
  );

  assert.equal(candidate?.type, "STEPS_PROGRESS");
  assert.equal(candidate?.contentKey, "progress");
  assert.equal(candidate?.metadata?.milestonePercent, 50);
  assert.equal(candidate?.progress.remainingSteps, 5000);
  assert.equal(candidate?.dedupeKey, "2026-05-15:STEPS_PROGRESS:milestone:50");
});

test("does not repeat an identical milestone notification", () => {
  const history = [
    {
      type: "STEPS_PROGRESS",
      sentAt: "2026-05-15T10:00:00.000Z",
      dedupeKey: "2026-05-15:STEPS_PROGRESS:milestone:50",
      progress: {
        dateKey: "2026-05-15",
        goalSteps: 10000,
        currentSteps: 5000,
        remainingSteps: 5000,
        progressRatio: 0.5,
        progressPercent: 50,
        hour: 13,
        timeOfDay: "midday",
      },
      metadata: {
        milestonePercent: 50,
      },
    },
  ];

  const candidate = evaluateStepNotification(
    {
      now: makeDate(13, 45),
      goalSteps: 10000,
      currentSteps: 5000,
    },
    history,
  );

  assert.equal(candidate, null);
});

test("prefers the near-goal notification over earlier progress milestones", () => {
  const candidate = evaluateStepNotification(
    {
      now: makeDate(18, 10),
      goalSteps: 10000,
      currentSteps: 9300,
    },
    [],
  );

  assert.equal(candidate?.type, "STEPS_PROGRESS");
  assert.equal(candidate?.contentKey, "near_goal");
  assert.equal(candidate?.progress.remainingSteps, 700);
});

test("sends a goal-reached notification once the target is completed", () => {
  const candidate = evaluateStepNotification(
    {
      now: makeDate(18, 40),
      goalSteps: 10000,
      currentSteps: 10040,
    },
    [],
  );

  assert.equal(candidate?.type, "STEPS_GOAL_REACHED");
  assert.equal(candidate?.contentKey, "goal_reached");
  assert.equal(candidate?.dedupeKey, "2026-05-15:STEPS_GOAL_REACHED");
});

test("sends an over-goal notification only after goal reached was already recorded", () => {
  const history = [
    {
      type: "STEPS_GOAL_REACHED",
      sentAt: "2026-05-15T15:00:00.000Z",
      dedupeKey: "2026-05-15:STEPS_GOAL_REACHED",
      progress: {
        dateKey: "2026-05-15",
        goalSteps: 10000,
        currentSteps: 10020,
        remainingSteps: 0,
        progressRatio: 1.002,
        progressPercent: 100,
        hour: 15,
        timeOfDay: "afternoon",
      },
    },
  ];

  const candidate = evaluateStepNotification(
    {
      now: makeDate(20, 5),
      goalSteps: 10000,
      currentSteps: 12600,
    },
    history,
  );

  assert.equal(candidate?.type, "STEPS_OVER_GOAL");
  assert.equal(candidate?.contentKey, "over_goal");
  assert.equal(candidate?.metadata?.extraSteps, 2600);
});

test("sends a low-activity reminder inside the midday window", () => {
  const candidate = evaluateStepNotification(
    {
      now: makeDate(11, 30),
      goalSteps: 10000,
      currentSteps: 900,
    },
    [],
  );

  assert.equal(candidate?.type, "STEPS_LOW_ACTIVITY");
  assert.equal(candidate?.contentKey, "low_activity_midday");
  assert.equal(candidate?.metadata?.slot, "midday");
});

test("builds text separately from rule evaluation", () => {
  const candidate = evaluateStepNotification(
    {
      now: makeDate(13, 15),
      goalSteps: 10000,
      currentSteps: 5000,
    },
    [],
  );

  const message = buildStepNotificationContent(candidate, "ru");

  assert.equal(typeof message.title, "string");
  assert.equal(typeof message.body, "string");
  assert.match(message.body, /5000/u);
});
