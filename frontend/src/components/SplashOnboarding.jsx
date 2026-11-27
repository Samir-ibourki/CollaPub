import { useEffect } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const img1 = require("../../assets/img1.jpg");

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
const FONT_TITLE = "PlusJakartaSans_800ExtraBold";
const FONT_EYEBROW = "Inter_500Medium";

const TEXT_TRAVEL = 90;
const TEXT_BOTTOM_RATIO = 0.11;

export default function SplashOnboarding({
  active = true,
  source = img1,
  eyebrow = "Creator x Brands",
  title = "Let's Collab",
}) {
  const reduced = useReducedMotion();
  const { height } = useWindowDimensions();

  const imageOpacity = useSharedValue(reduced ? 1 : 0);
  const imageScale = useSharedValue(reduced ? 1 : 1.08);
  const textOpacity = useSharedValue(reduced ? 1 : 0);
  const textY = useSharedValue(reduced ? 0 : TEXT_TRAVEL);

  useEffect(() => {
    if (!active) return;

    if (reduced) {
      imageOpacity.value = 1;
      imageScale.value = 1;
      textOpacity.value = 1;
      textY.value = 0;
      return;
    }

    // 1. L'photo
    imageOpacity.value = withTiming(1, { duration: 1400, easing: EASE_OUT });
    imageScale.value = withTiming(1, { duration: 1400, easing: EASE_OUT });

    // 2. texte
    textOpacity.value = withDelay(
      200,
      withTiming(1, { duration: 600, easing: EASE_OUT })
    );
    textY.value = withDelay(
      200,
      withTiming(0, { duration: 1000, easing: EASE_OUT })
    );
  }, [active]);

  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }));

  const gradientStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Photo */}
      <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
        <Image
          source={source}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
      </Animated.View>

      {/* Gradient for text be clear in buttm */}
      <Animated.View
        pointerEvents="none"
        style={[styles.gradientWrap, gradientStyle]}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.8)"]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Eyebrow + titre */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.textWrap,
          { bottom: height * TEXT_BOTTOM_RATIO },
          textStyle,
        ]}
        accessible
        accessibilityLabel={`${eyebrow}. ${title}`}
      >
        <Animated.Text style={styles.eyebrow}>{eyebrow}</Animated.Text>
        <Animated.Text style={styles.title}>{title}</Animated.Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF", 
    overflow: "hidden",
  },
  gradientWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
  },
  textWrap: {
    position: "absolute",
    left: 32,
    right: 32,
    alignItems: "center",
  },
  eyebrow: {
    fontFamily: FONT_EYEBROW,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 2.5,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: FONT_TITLE,
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -1.4,
    color: "#FFFFFF",
    textAlign: "center",
    maxWidth: "85%",
  },
});