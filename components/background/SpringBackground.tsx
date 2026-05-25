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

type SpringBackgroundProps = {
  children: React.ReactNode;

  /** Кол-во лепестков (30–120) */
  petals?: number;

  /** Кол-во пыльцы/bokeh (20–80) */
  pollen?: number;

  /** Скорость (1 = норм, 0.7 медленнее, 1.4 быстрее) */
  speed?: number;

  /** Сила ветра (0..1.6) */
  wind?: number;

  /** Лепестки поверх контента? */
  overlay?: boolean;

  /** Доп. стиль контейнера */
  style?: ViewStyle;

  /** Цвет лепестков (можно оставить дефолт) */
  petalColor?: string;

  /** Цвет пыльцы */
  pollenColor?: string;

  /** Показывать пыльцу */
  showPollen?: boolean;
};

type Petal = {
  id: string;

  x: number;
  size: number;
  opacityBase: number;

  fallMs: number;
  swayMs: number;
  swayAmp: number;

  drift: number;
  startY: number;

  // вращение + "флип" (как настоящие лепестки)
  rotMs: number;
  rotDir: 1 | -1;

  y: Animated.Value;
  sway: Animated.Value;
  spin: Animated.Value;
  flip: Animated.Value;

  _timer?: ReturnType<typeof setTimeout>;
};

type PollenDot = {
  id: string;
  x: number;
  size: number;
  opacityBase: number;
  drift: number;
  riseMs: number;
  startY: number;

  y: Animated.Value;
  shimmer: Animated.Value;

  _timer?: ReturnType<typeof setTimeout>;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function mixToWhite(hex: string, t: number) {
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

export default function SpringBackground({
  children,
  petals = 72,
  pollen = 44,
  speed = 1,
  wind = 0.95,
  overlay = false,
  style,
  petalColor = "#ffb3d1", // нежно-розовый
  pollenColor = "#fff2a8", // мягкий жёлтый
  showPollen = true,
}: SpringBackgroundProps) {
  const { width, height } = useWindowDimensions();

  const petalData = useMemo<Petal[]>(() => {
    const list: Petal[] = [];
    for (let i = 0; i < petals; i++) {
      const size = rand(6, 16);
      const opacityBase = rand(0.25, 0.9);

      const x = rand(-20, width + 20);
      const startY = rand(-height, 0);

      const fallMs = rand(6500, 14000) / clamp(speed, 0.2, 3);

      const swayMs = rand(1700, 4200);
      const swayAmp = rand(10, 46) * (0.7 + clamp(wind, 0, 1.6) * 0.35);

      const drift = rand(14, 44) * clamp(wind, 0, 1.6);

      const rotMs = rand(1400, 3400);
      const rotDir: 1 | -1 = Math.random() > 0.5 ? 1 : -1;

      list.push({
        id: `petal_${i}_${Math.random().toString(16).slice(2)}`,
        x,
        size,
        opacityBase,
        fallMs,
        swayMs,
        swayAmp,
        drift,
        startY,
        rotMs,
        rotDir,
        y: new Animated.Value(startY),
        sway: new Animated.Value(rand(0, 1)),
        spin: new Animated.Value(rand(0, 1)),
        flip: new Animated.Value(rand(0, 1)),
      });
    }
    return list;
  }, [petals, width, height, speed, wind]);

  const pollenData = useMemo<PollenDot[]>(() => {
    if (!showPollen) return [];
    const list: PollenDot[] = [];
    for (let i = 0; i < pollen; i++) {
      const size = rand(2, 7);
      const opacityBase = rand(0.08, 0.28);

      const x = rand(0, width);
      const startY = rand(0, height);

      const riseMs = rand(9000, 20000) / clamp(speed, 0.2, 3);
      const drift = rand(10, 34) * clamp(wind, 0, 1.6);

      list.push({
        id: `pollen_${i}_${Math.random().toString(16).slice(2)}`,
        x,
        size,
        opacityBase,
        drift,
        riseMs,
        startY,
        y: new Animated.Value(startY),
        shimmer: new Animated.Value(rand(0, 1)),
      });
    }
    return list;
  }, [pollen, width, height, speed, wind, showPollen]);

  const runningRef = useRef<Animated.CompositeAnimation[]>([]);
  const petalRef = useRef<Petal[]>([]);
  const pollenRef = useRef<PollenDot[]>([]);
  petalRef.current = petalData;
  pollenRef.current = pollenData;

  useEffect(() => {
    runningRef.current.forEach((a) => a.stop());
    runningRef.current = [];

    // чистим таймеры
    petalRef.current.forEach((p) => p._timer && clearTimeout(p._timer));
    pollenRef.current.forEach((d) => d._timer && clearTimeout(d._timer));

    const spawnPetal = (p: Petal) => {
      p.startY = rand(-height, -40);
      p.x = rand(-40, width + 40);

      p.y.setValue(p.startY);

      const fall = Animated.timing(p.y, {
        toValue: height + 80,
        duration: p.fallMs * rand(0.88, 1.12),
        easing: Easing.linear,
        useNativeDriver: true,
      });

      fall.start(({ finished }) => {
        if (!finished) return;
        const delay = rand(0, 1100);
        p._timer = setTimeout(() => spawnPetal(p), delay);
      });

      runningRef.current.push(fall);
    };

    const spawnPollen = (d: PollenDot) => {
      // пыльца плавно летает вверх и появляется снизу/середины снова
      d.startY = rand(height * 0.2, height + 60);
      d.x = rand(-20, width + 20);

      d.y.setValue(d.startY);

      const rise = Animated.timing(d.y, {
        toValue: -80,
        duration: d.riseMs * rand(0.9, 1.2),
        easing: Easing.linear,
        useNativeDriver: true,
      });

      rise.start(({ finished }) => {
        if (!finished) return;
        const delay = rand(0, 1400);
        d._timer = setTimeout(() => spawnPollen(d), delay);
      });

      runningRef.current.push(rise);
    };

    // запускаем лепестки
    petalData.forEach((p) => {
      const sway = Animated.loop(
        Animated.sequence([
          Animated.timing(p.sway, {
            toValue: 1,
            duration: p.swayMs,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(p.sway, {
            toValue: 0,
            duration: p.swayMs,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );

      const spin = Animated.loop(
        Animated.sequence([
          Animated.timing(p.spin, {
            toValue: 1,
            duration: p.rotMs,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(p.spin, {
            toValue: 0,
            duration: p.rotMs,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      );

      const flip = Animated.loop(
        Animated.sequence([
          Animated.timing(p.flip, {
            toValue: 1,
            duration: rand(900, 1800),
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(p.flip, {
            toValue: 0,
            duration: rand(900, 1800),
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );

      sway.start();
      spin.start();
      flip.start();

      runningRef.current.push(sway, spin, flip);

      const startDelay = rand(0, 1300);
      p._timer = setTimeout(() => spawnPetal(p), startDelay);
    });

    // запускаем пыльцу
    pollenData.forEach((d) => {
      const shimmer = Animated.loop(
        Animated.sequence([
          Animated.timing(d.shimmer, {
            toValue: 1,
            duration: rand(1200, 2600),
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(d.shimmer, {
            toValue: 0,
            duration: rand(1200, 2600),
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );

      shimmer.start();
      runningRef.current.push(shimmer);

      const startDelay = rand(0, 1600);
      d._timer = setTimeout(() => spawnPollen(d), startDelay);
    });

    return () => {
      runningRef.current.forEach((a) => a.stop());
      runningRef.current = [];

      petalRef.current.forEach((p) => p._timer && clearTimeout(p._timer));
      pollenRef.current.forEach((d) => d._timer && clearTimeout(d._timer));
    };
  }, [petalData, pollenData, height, width]);

  const PetalLayer = (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {petalData.map((p) => {
        const translateX = p.sway.interpolate({
          inputRange: [0, 1],
          outputRange: [-p.swayAmp, p.swayAmp],
        });

        const driftX = p.y.interpolate({
          inputRange: [-height, height + 80],
          outputRange: [-(p.drift * 0.15), p.drift],
          extrapolate: "clamp",
        });

        const opacity = p.flip.interpolate({
          inputRange: [0, 1],
          outputRange: [p.opacityBase * 0.75, p.opacityBase],
        });

        const rotate = p.spin.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", `${p.rotDir * 360}deg`],
        });

        // лепесток: маленькая “капля” (похожа на сакуру)
        const bg = mixToWhite(petalColor, rand(0.1, 0.35));

        // лёгкая деформация (флип) по X/Y
        const scaleX = p.flip.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.72],
        });
        const scaleY = p.flip.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.15],
        });

        return (
          <Animated.View
            key={p.id}
            style={[
              styles.petalWrap,
              {
                left: p.x,
                width: p.size,
                height: p.size,
                opacity,
                transform: [
                  { translateX },
                  { translateX: driftX },
                  { translateY: p.y },
                  { rotate },
                  { scaleX },
                  { scaleY },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.petal,
                {
                  backgroundColor: bg,
                  borderRadius: p.size,
                  // легкая тень (iOS)
                  shadowColor: bg,
                  shadowOpacity: Platform.OS === "ios" ? 0.2 : 0,
                  shadowRadius: Platform.OS === "ios" ? p.size * 0.55 : 0,
                  shadowOffset: { width: 0, height: 0 },
                },
              ]}
            />
            {/* сердцевина */}
            <View
              style={[
                styles.petalCore,
                {
                  width: Math.max(1.5, p.size * 0.22),
                  height: Math.max(1.5, p.size * 0.22),
                  borderRadius: 999,
                  backgroundColor: mixToWhite("#ff7fb2", 0.25),
                  opacity: 0.55,
                },
              ]}
            />
          </Animated.View>
        );
      })}
    </View>
  );

  const PollenLayer = !showPollen ? null : (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pollenData.map((d) => {
        const opacity = d.shimmer.interpolate({
          inputRange: [0, 1],
          outputRange: [d.opacityBase * 0.7, d.opacityBase],
        });

        const driftX = d.y.interpolate({
          inputRange: [-80, height + 80],
          outputRange: [d.drift, -(d.drift * 0.2)],
          extrapolate: "clamp",
        });

        const tint = mixToWhite(pollenColor, rand(0.08, 0.25));

        return (
          <Animated.View
            key={d.id}
            style={[
              styles.pollen,
              {
                left: d.x,
                width: d.size,
                height: d.size,
                borderRadius: d.size / 2,
                backgroundColor: tint,
                opacity,
                transform: [{ translateX: driftX }, { translateY: d.y }],
              },
            ]}
          />
        );
      })}
    </View>
  );

  const Layer = (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* сначала пыльца, потом лепестки */}
      {PollenLayer}
      {PetalLayer}
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {!overlay && <View style={StyleSheet.absoluteFill}>{Layer}</View>}
      <View style={styles.content}>{children}</View>
      {overlay && <View style={StyleSheet.absoluteFill}>{Layer}</View>}
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

  petalWrap: {
    position: "absolute",
    top: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  petal: {
    width: "100%",
    height: "100%",
    // форма “лепестка”
    transform: [{ rotate: "35deg" }],
  },
  petalCore: {
    position: "absolute",
  },

  pollen: {
    position: "absolute",
    top: 0,
  },
});
