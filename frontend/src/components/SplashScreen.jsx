import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

const SPLASH = {
  top: "#E8EEFF",
  text: "#0F1419",
  primary: "#3B5BDB",
  subtitle: "rgba(15, 20, 25, 0.55)",
  ringPrimary: "rgba(59, 91, 219, 0.10)",
  ringSecondary: "rgba(59, 91, 219, 0.08)",
  gradient: ["#E8EEFF", "#F8F9FB", "#DCE4FC", "#3B5BDB"],
  locations: [0, 0.36, 0.76, 1],
};

export default function SplashScreen({ onReveal, onDone }) {
  const reducedMotion = useReducedMotion();

  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(reducedMotion ? 0 : 12);
  const ringOpacity = useSharedValue(0);
  const ringScale = useSharedValue(reducedMotion ? 1 : 0.92);
  const subOpacity = useSharedValue(0);
  const zoomScale = useSharedValue(1);
  const zoomOpacity = useSharedValue(1);
  const fadeOut = useSharedValue(1);

  useEffect(() => {
    const ZOOM_AT = reducedMotion ? 1000 : 1300;

    titleOpacity.set(
      withSequence(
        withTiming(1, {
          duration: reducedMotion ? 200 : 500,
          easing: EASE_OUT,
        }),
        withDelay(
          Math.max(0, ZOOM_AT - (reducedMotion ? 200 : 500) + 320),
          withTiming(1, { duration: 10 }, (finished) => {
            if (finished && onReveal) runOnJS(onReveal)();
          }),
        ),
      ),
    );

    if (!reducedMotion) {
      titleY.set(withTiming(0, { duration: 520, easing: EASE_OUT }));
      ringScale.set(withTiming(1, { duration: 750, easing: EASE_OUT }));

      ringOpacity.set(
        withSequence(
          withTiming(1, { duration: 650, easing: EASE_OUT }),
          withDelay(ZOOM_AT - 750, withTiming(0, { duration: 300 })),
        ),
      );
      subOpacity.set(
        withSequence(
          withDelay(280, withTiming(1, { duration: 400, easing: EASE_OUT })),
          withDelay(ZOOM_AT - 780, withTiming(0, { duration: 250 })),
        ),
      );

      zoomScale.set(
        withDelay(
          ZOOM_AT,
          withTiming(8, { duration: 750, easing: Easing.in(Easing.exp) }),
        ),
      );
      zoomOpacity.set(
        withDelay(ZOOM_AT + 400, withTiming(0, { duration: 350 })),
      );
    } else {
      ringOpacity.set(withTiming(1, { duration: 200, easing: EASE_OUT }));
      subOpacity.set(withTiming(1, { duration: 200, easing: EASE_OUT }));
    }

    fadeOut.set(
      withDelay(
        ZOOM_AT + 200,
        withTiming(0, { duration: 320 }, (finished) => {
          if (finished && onDone) runOnJS(onDone)();
        }),
      ),
    );
  }, [
    fadeOut,
    onDone,
    onReveal,
    reducedMotion,
    ringOpacity,
    ringScale,
    subOpacity,
    titleOpacity,
    titleY,
    zoomOpacity,
    zoomScale,
  ]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.get(),
    transform: [{ translateY: titleY.get() }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.get(),
    transform: [{ scale: ringScale.get() }],
  }));

  const subStyle = useAnimatedStyle(() => ({
    opacity: subOpacity.get(),
  }));

  const zoomStyle = useAnimatedStyle(() => ({
    opacity: zoomOpacity.get(),
    transform: [{ scale: zoomScale.get() }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeOut.get(),
  }));

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: SPLASH.top }, containerStyle]}
    >
      <LinearGradient
        colors={SPLASH.gradient}
        locations={SPLASH.locations}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View pointerEvents="none" style={[styles.ringsWrap, ringStyle]}>
        <View style={styles.ringOuter} />
        <View style={styles.ringInner} />
      </Animated.View>

      <View style={styles.center}>
        <Animated.View style={zoomStyle}>
          <View
            style={styles.wordmarkRow}
            accessible
            accessibilityLabel="CollaPub"
          >
            <Animated.View style={[styles.titleWrap, titleStyle]}>
              <Text style={styles.titleFirst}>Colla</Text>
              <Text style={styles.titleSecond}>Pub</Text>
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.Text style={[styles.subtitle, subStyle]}>
          CREATORS × BRANDS
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ringsWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },
  ringOuter: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: SPLASH.ringPrimary,
  },
  ringInner: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: SPLASH.ringSecondary,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  wordmarkRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  titleWrap: {
    flexDirection: "row",
  },
  titleFirst: {
    fontFamily: "PlusJakartaSans_800ExtraBold",
    fontSize: 44,
    lineHeight: 52,
    letterSpacing: -1.4,
    color: SPLASH.text,
  },
  titleSecond: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 44,
    lineHeight: 52,
    letterSpacing: -1.2,
    color: SPLASH.primary,
  },
  subtitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 3,
    color: SPLASH.subtitle,
  },
});
