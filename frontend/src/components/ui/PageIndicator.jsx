import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/theme";

const BAR_EASING = Easing.bezier(0.23, 1, 0.32, 1);

// continuous horizontal progress bar for onboarding steps
export function PageIndicator({ count, activeIndex, accessibilityLabel }) {
  const { colors, radius, motion } = useTheme();
  const reducedMotion = useReducedMotion();

  const targetProgress = Math.min(Math.max((activeIndex + 1) / count, 0), 1);
  const progress = useSharedValue(targetProgress);

  useEffect(() => {
    if (reducedMotion) {
      progress.set(targetProgress);
      return;
    }
    progress.set(
      withTiming(targetProgress, {
        duration: motion.base,
        easing: BAR_EASING,
      }),
    );
  }, [motion.base, progress, reducedMotion, targetProgress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.get() * 100}%`,
  }));

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 1, max: count, now: activeIndex + 1 }}
      style={{
        flex: 1,
        height: 4,
        borderRadius: radius.pill,
        backgroundColor: colors.dotInactive,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[
          {
            height: "100%",
            borderRadius: radius.pill,
            backgroundColor: colors.primary,
          },
          fillStyle,
        ]}
      />
    </View>
  );
}
