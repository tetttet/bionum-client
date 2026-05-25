import { Dimensions, PixelRatio } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

const EXTRA_SMALL_PHONE_WIDTH = 340;
const SMALL_PHONE_WIDTH = 360;
const COMPACT_PHONE_WIDTH = 390;

// Main knob for the whole app typography.
// Lower the value to make the UI more compact, raise it to make text larger.
export const GLOBAL_TYPE_SCALE = 1;

const DEVICE_TYPE_SCALE =
  SCREEN_WIDTH <= EXTRA_SMALL_PHONE_WIDTH
    ? 0.82
    : SCREEN_WIDTH <= SMALL_PHONE_WIDTH
      ? 0.88
      : SCREEN_WIDTH <= COMPACT_PHONE_WIDTH
        ? 0.94
        : 1;

export const TYPOGRAPHY_SCALE = Math.max(
  0.8,
  Math.min(1.08, DEVICE_TYPE_SCALE * GLOBAL_TYPE_SCALE),
);

const clamp = (value: number, min?: number, max?: number) => {
  if (typeof min === "number" && value < min) return min;
  if (typeof max === "number" && value > max) return max;
  return value;
};

const round = (value: number) => PixelRatio.roundToNearestPixel(value);

type ScaleOptions = {
  min?: number;
  max?: number;
};

export const fs = (size: number, options?: ScaleOptions) =>
  clamp(round(size * TYPOGRAPHY_SCALE), options?.min, options?.max);

export const lh = (size: number, options?: ScaleOptions) =>
  clamp(round(size * TYPOGRAPHY_SCALE), options?.min, options?.max);

export const fontSizes = {
  xs: fs(11),
  sm: fs(12),
  md: fs(14),
  base: fs(16),
  lg: fs(18),
  xl: fs(20),
  xxl: fs(24),
  hero: fs(32),
} as const;
