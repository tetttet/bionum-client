import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";

type SnowBackgroundProps = {
  children: React.ReactNode;

  /** Кол-во снежинок (80–220 выглядит прям как снег) */
  flakes?: number;

  /** Базовый цвет (будет чуть варьироваться) */
  color?: string;

  /** Скорость (1 = норм, 0.6 медленнее, 1.6 быстрее) */
  speed?: number;

  /** Доп. стиль контейнера */
  style?: ViewStyle;

  /** Снег поверх контента? */
  overlay?: boolean;

  /** Сила ветра (0..1.6) */
  wind?: number;
};

type Flake = {
  id: string;
  layer: 0 | 1 | 2;

  x: number;
  size: number;

  opacityBase: number;
  blur: number;

  fallMs: number;
  swayMs: number;
  swayAmp: number;

  drift: number; // постоянный снос по X (ветер)
  startY: number;

  y: Animated.Value;
  sway: Animated.Value;

  // чтобы мы могли респавнить рандомно
  _fallTimer?: ReturnType<typeof setTimeout>;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function mixSnowColor(hex: string, t: number) {
  // простая смесь с белым, чтобы снежинки были не “одинаково голубые”
  // t: 0..1
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);

  const rr = Math.round(r + (255 - r) * t);
  const gg = Math.round(g + (255 - g) * t);
  const bb = Math.round(b + (255 - b) * t);

  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`;
}

export default function SnowBackground({
  children,
  flakes = 160,
  color = "#ffffff",
  speed = 1,
  style,
  overlay = false,
  wind = 0.9,
}: SnowBackgroundProps) {
  const { width, height } = useWindowDimensions();

  const flakeData = useMemo<Flake[]>(() => {
    const list: Flake[] = [];

    // 3 слоя: много мелких, средних меньше, крупных ещё меньше
    const layer0 = Math.round(flakes * 0.62); // мелкий “плотный”
    const layer1 = Math.round(flakes * 0.28); // средний
    const layer2 = Math.max(6, flakes - layer0 - layer1); // крупный ближний

    const pushLayer = (count: number, layer: 0 | 1 | 2) => {
      for (let i = 0; i < count; i++) {
        // слой влияет на размер/скорость/размах
        const size =
          layer === 0
            ? rand(1.2, 3.2)
            : layer === 1
              ? rand(2.6, 5.2)
              : rand(4.6, 8.6);

        const opacityBase =
          layer === 0
            ? rand(0.15, 0.55)
            : layer === 1
              ? rand(0.25, 0.75)
              : rand(0.35, 0.9);

        // "мягкость": на iOS тени выглядят ок, на Android тени хуже — там делаем меньше blur
        const blurBase =
          layer === 0 ? rand(4, 10) : layer === 1 ? rand(7, 16) : rand(10, 22);
        const blur = Platform.OS === "android" ? blurBase * 0.55 : blurBase;

        const x = rand(0, width);
        const startY = rand(-height, 0);

        // скорость падения (крупнее = быстрее)
        const fallMsBase =
          layer === 0
            ? rand(9000, 17000)
            : layer === 1
              ? rand(6500, 12000)
              : rand(4200, 8200);
        const fallMs = fallMsBase / clamp(speed, 0.2, 3);

        // покачивание
        const swayMsBase =
          layer === 0
            ? rand(2200, 5200)
            : layer === 1
              ? rand(1800, 4200)
              : rand(1400, 3200);
        const swayMs = swayMsBase;

        const swayAmpBase =
          layer === 0 ? rand(6, 18) : layer === 1 ? rand(12, 34) : rand(18, 56);

        // ветер: крупные сносит больше
        const windK = clamp(wind, 0, 1.6);
        const drift =
          (layer === 0
            ? rand(6, 16)
            : layer === 1
              ? rand(14, 30)
              : rand(22, 44)) * windK;

        list.push({
          id: `flake_${layer}_${i}_${Math.random().toString(16).slice(2)}`,
          layer,
          x,
          size,
          opacityBase,
          blur,
          fallMs,
          swayMs,
          swayAmp: swayAmpBase * (0.7 + windK * 0.35),
          drift,
          startY,
          y: new Animated.Value(startY),
          sway: new Animated.Value(rand(0, 1)),
        });
      }
    };

    pushLayer(layer0, 0);
    pushLayer(layer1, 1);
    pushLayer(layer2, 2);

    return list;
  }, [flakes, width, height, speed, wind]);

  const runningRef = useRef<Animated.CompositeAnimation[]>([]);
  const flakeRef = useRef<Flake[]>([]);
  flakeRef.current = flakeData;

  useEffect(() => {
    // стопаем старые
    runningRef.current.forEach((a) => a.stop());
    runningRef.current = [];

    // чистим таймеры респавна
    flakeRef.current.forEach((f) => {
      if (f._fallTimer) clearTimeout(f._fallTimer);
      f._fallTimer = undefined;
    });

    const spawn = (f: Flake) => {
      // новый старт (чуть выше экрана) + новый X
      f.startY = rand(-height, -20);
      f.x = rand(-20, width + 20);

      // небольшая вариативность, чтобы не было “одного и того же цикла”
      const layerSpeedMul =
        f.layer === 0
          ? rand(0.9, 1.2)
          : f.layer === 1
            ? rand(0.9, 1.15)
            : rand(0.85, 1.1);
      const fallMs = (f.fallMs * layerSpeedMul) / clamp(speed, 0.2, 3);

      f.y.setValue(f.startY);

      const fall = Animated.timing(f.y, {
        toValue: height + 60,
        duration: fallMs,
        easing: Easing.linear,
        useNativeDriver: true,
      });

      fall.start(({ finished }) => {
        if (!finished) return;
        // респавн с небольшим случайным лагом (важно для реализма)
        const delay = rand(0, 900);
        f._fallTimer = setTimeout(() => spawn(f), delay);
      });

      runningRef.current.push(fall);
    };

    // отдельная бесконечная “качалка” для всех + падение с респавном
    flakeData.forEach((f) => {
      const sway = Animated.loop(
        Animated.sequence([
          Animated.timing(f.sway, {
            toValue: 1,
            duration: f.swayMs,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(f.sway, {
            toValue: 0,
            duration: f.swayMs,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );

      sway.start();
      runningRef.current.push(sway);

      // стартуем падение не одновременно (разный оффсет)
      const startDelay = rand(0, 1200);
      f._fallTimer = setTimeout(() => spawn(f), startDelay);
    });

    return () => {
      runningRef.current.forEach((a) => a.stop());
      runningRef.current = [];

      flakeRef.current.forEach((f) => {
        if (f._fallTimer) clearTimeout(f._fallTimer);
        f._fallTimer = undefined;
      });
    };
  }, [flakeData, height, width, speed]);

  const SnowLayer = (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {flakeData.map((f) => {
        const translateX = f.sway.interpolate({
          inputRange: [0, 1],
          outputRange: [-f.swayAmp, f.swayAmp],
        });

        // лёгкое мерцание + глубина: дальний слой слабее
        const depthMul = f.layer === 0 ? 0.85 : f.layer === 1 ? 1 : 1.08;

        const flakeOpacity = f.sway.interpolate({
          inputRange: [0, 1],
          outputRange: [f.opacityBase * 0.75, f.opacityBase],
        });

        // постоянный снос по ветру (вниз-вправо)
        const driftX = f.y.interpolate({
          inputRange: [-height, height + 60],
          outputRange: [-(f.drift * 0.15), f.drift],
          extrapolate: "clamp",
        });

        // чуть разный оттенок “снежного” цвета
        const snowTint = mixSnowColor(color, clamp(rand(0.12, 0.38), 0, 1));

        return (
          <Animated.View
            key={f.id}
            style={[
              styles.flake,
              {
                left: f.x,
                width: f.size,
                height: f.size,
                borderRadius: f.size / 2,
                backgroundColor: snowTint,
                opacity: flakeOpacity,

                // мягкость (iOS)
                shadowColor: snowTint,
                shadowOpacity: Platform.OS === "ios" ? 0.28 * depthMul : 0,
                shadowRadius: Platform.OS === "ios" ? f.blur : 0,
                shadowOffset: { width: 0, height: 0 },

                transform: [
                  { translateX },
                  { translateX: driftX },
                  { translateY: f.y },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {!overlay && <View style={StyleSheet.absoluteFill}>{SnowLayer}</View>}
      <View style={styles.content}>{children}</View>
      {overlay && <View style={StyleSheet.absoluteFill}>{SnowLayer}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    overflow: "hidden",
  },
  content: {
    position: "relative",
    zIndex: 1,
    flex: 1,
  },
  flake: {
    position: "absolute",
    top: 0,
  },
});
