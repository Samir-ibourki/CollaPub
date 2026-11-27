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
  withSequence,
  withTiming,
} from "react-native-reanimated";

const img1 = require("../../assets/img1.jpg");

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
const FONT_TITLE = "PlusJakartaSans_800ExtraBold";
const FONT_EYEBROW = "Inter_500Medium";

const TEXT_TRAVEL = 90;
const TEXT_BOTTOM_RATIO = 0.11;
const CARD_MORPH_DELAY = 1800;

export default function SplashOnboarding({
  active = true,
  source = img1,
  eyebrow = "Creator x Brands",
  title = "Let's Collab",
}) {
  const reduced = useReducedMotion();
  const { width, height } = useWindowDimensions();

  const cardW = Math.round(width * 0.68);
  const cardH = Math.round(width * 0.76);
  const targetLeft = Math.round((width - cardW) / 2);
  const targetTop = Math.round((height - cardH) / 2);

  const imageOpacity = useSharedValue(reduced ? 1 : 0);
  const imageScale = useSharedValue(reduced ? 1 : 1.08);
  const textOpacity = useSharedValue(reduced ? 1 : 0);
  const textY = useSharedValue(reduced ? 0 : TEXT_TRAVEL);
  const textBottom = useSharedValue(
    reduced ? 22 : Math.round(height * TEXT_BOTTOM_RATIO),
  );

  const cardLeft = useSharedValue(reduced ? targetLeft : 0);
  const cardTop = useSharedValue(reduced ? targetTop : 0);
  const cardWidth = useSharedValue(reduced ? cardW : width);
  const cardHeight = useSharedValue(reduced ? cardH : height);
  const cardRadius = useSharedValue(reduced ? 24 : 0);

  useEffect(() => {
    if (!active) return;

    if (reduced) {
      imageOpacity.value = 1;
      imageScale.value = 1;
      textOpacity.value = 1;
      textY.value = 0;
      textBottom.value = 22;
      cardLeft.value = targetLeft;
      cardTop.value = targetTop;
      cardWidth.value = cardW;
      cardHeight.value = cardH;
      cardRadius.value = 24;
      return;
    }

    // 1. Photo
    imageOpacity.value = withTiming(1, { duration: 700, easing: EASE_OUT });
    imageScale.value = withTiming(1, { duration: 1400, easing: EASE_OUT });

    // 2. Text rises from bottom
    textOpacity.value = withSequence(
      withDelay(200, withTiming(1, { duration: 600, easing: EASE_OUT })),
      withDelay(
        CARD_MORPH_DELAY - 800,
        withTiming(0.25, { duration: 350, easing: EASE_OUT }),
      ),
      withDelay(100, withTiming(1, { duration: 350, easing: EASE_OUT })),
    );
    textY.value = withDelay(
      200,
      withTiming(0, { duration: 1000, easing: EASE_OUT }),
    );
    textBottom.value = withDelay(
      CARD_MORPH_DELAY,
      withTiming(22, { duration: 800, easing: EASE_OUT }),
    );

    // 3. Full-screen hero morphs into rounded card in center
    cardLeft.value = withDelay(
      CARD_MORPH_DELAY,
      withTiming(targetLeft, { duration: 800, easing: EASE_OUT }),
    );
    cardTop.value = withDelay(
      CARD_MORPH_DELAY,
      withTiming(targetTop, { duration: 800, easing: EASE_OUT }),
    );
    cardWidth.value = withDelay(
      CARD_MORPH_DELAY,
      withTiming(cardW, { duration: 800, easing: EASE_OUT }),
    );
    cardHeight.value = withDelay(
      CARD_MORPH_DELAY,
      withTiming(cardH, { duration: 800, easing: EASE_OUT }),
    );
    cardRadius.value = withDelay(
      CARD_MORPH_DELAY,
      withTiming(24, { duration: 800, easing: EASE_OUT }),
    );
  }, [active]);

  const cardWrapStyle = useAnimatedStyle(() => ({
    left: cardLeft.value,
    top: cardTop.value,
    width: cardWidth.value,
    height: cardHeight.value,
    borderRadius: cardRadius.value,
  }));

  const cardInnerStyle = useAnimatedStyle(() => ({
    borderRadius: cardRadius.value,
  }));

  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }));

  const gradientStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    bottom: textBottom.value,
    transform: [{ translateY: textY.value }],
  }));

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <Animated.View style={[styles.cardShadow, cardWrapStyle]}>
        <Animated.View style={[styles.cardInner, cardInnerStyle]}>
          {/* Photo */}
          <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
            <Image
              source={source}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          </Animated.View>

          {/* Dark bottom gradient for readable text */}
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

          {/* Eyebrow + title */}
          <Animated.View
            pointerEvents="none"
            style={[styles.textWrap, textStyle]}
            accessible
            accessibilityLabel={`${eyebrow}. ${title}`}
          >
            <Animated.Text style={styles.eyebrow}>{eyebrow}</Animated.Text>
            <Animated.Text style={styles.title}>{title}</Animated.Text>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  cardShadow: {
    position: "absolute",
    shadowColor: "#0F1419",
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  cardInner: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
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
    left: 20,
    right: 20,
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
    fontSize: 42,
    lineHeight: 46,
    letterSpacing: -1.2,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
