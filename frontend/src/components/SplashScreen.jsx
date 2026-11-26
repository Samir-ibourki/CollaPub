import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

const SPLASH = {
  top: "#E8EEFF",
  text: "#0F1419",
  primary: "#3B5BDB",
  dot: "#D96B43",
  subtitle: "rgba(15, 20, 25, 0.55)",
  ringPrimary: "rgba(59, 91, 219, 0.10)",
  ringSecondary: "rgba(217, 107, 67, 0.12)",
  gradient: ["#E8EEFF", "#F8F9FB", "#DCE4FC", "#3B5BDB"],
  locations: [0, 0.36, 0.76, 1],
};

// minimalist splash screen with subtle architectural rings and tinted top gradient
export default function SplashScreen() {
  const reducedMotion = useReducedMotion();

  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(reducedMotion ? 0 : 12);
  const dotOpacity = useSharedValue(0);
  const dotScale = useSharedValue(reducedMotion ? 1 : 0.6);
  const ringOpacity = useSharedValue(0);
  const ringScale = useSharedValue(reducedMotion ? 1 : 0.92);
  const subOpacity = useSharedValue(0);

  useEffect(() => {
    titleOpacity.set(
      withTiming(1, {
        duration: reducedMotion ? 200 : 500,
        easing: EASE_OUT,
      }),
    );

    ringOpacity.set(
      withTiming(1, {
        duration: reducedMotion ? 200 : 650,
        easing: EASE_OUT,
      }),
    );

    if (!reducedMotion) {
      titleY.set(withTiming(0, { duration: 520, easing: EASE_OUT }));
      ringScale.set(withTiming(1, { duration: 750, easing: EASE_OUT }));
      dotOpacity.set(
        withDelay(180, withTiming(1, { duration: 280, easing: EASE_OUT })),
      );
      dotScale.set(
        withDelay(180, withTiming(1, { duration: 320, easing: EASE_OUT })),
      );
      subOpacity.set(
        withDelay(280, withTiming(1, { duration: 400, easing: EASE_OUT })),
      );
    } else {
      dotOpacity.set(withTiming(1, { duration: 200, easing: EASE_OUT }));
      subOpacity.set(withTiming(1, { duration: 200, easing: EASE_OUT }));
    }
  }, [
    dotOpacity,
    dotScale,
    reducedMotion,
    ringOpacity,
    ringScale,
    subOpacity,
    titleOpacity,
    titleY,
  ]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.get(),
    transform: [{ translateY: titleY.get() }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.get(),
    transform: [{ scale: dotScale.get() }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.get(),
    transform: [{ scale: ringScale.get() }],
  }));

  const subStyle = useAnimatedStyle(() => ({
    opacity: subOpacity.get(),
  }));

  return (
    <View style={[styles.container, { backgroundColor: SPLASH.top }]}>
      <LinearGradient
        colors={SPLASH.gradient}
        locations={SPLASH.locations}
        style={StyleSheet.absoluteFill}
      />

      {/* subtle architectural rings filling top and center */}
      <Animated.View pointerEvents="none" style={[styles.ringsWrap, ringStyle]}>
        <View style={styles.ringOuter} />
        <View style={styles.ringInner} />
      </Animated.View>

      <View style={styles.center}>
        <View style={styles.wordmarkRow} accessible accessibilityLabel="CollaPub">
          <Animated.View style={[styles.titleWrap, titleStyle]}>
            <Text style={styles.titleFirst}>Colla</Text>
            <Text style={styles.titleSecond}>Pub</Text>
          </Animated.View>
          <Animated.View style={[styles.dot, dotStyle]} />
        </View>

        <Animated.Text style={[styles.subtitle, subStyle]}>
          CREATORS × BRANDS
        </Animated.Text>
      </View>
    </View>
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
  dot: {
    width: 8,
    height: 8,
    borderRadius: 9999,
    backgroundColor: SPLASH.dot,
    marginLeft: 3,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 3,
    color: SPLASH.subtitle,
  },
});
