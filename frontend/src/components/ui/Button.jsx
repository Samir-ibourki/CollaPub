import { ActivityIndicator, Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/theme";
import { Text } from "./Text";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const PRESS_EASING = Easing.bezier(0.23, 1, 0.32, 1);

// accessible button with primary, secondary, and ghost variants
export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  onPress,
  accessibilityLabel,
  style,
}) {
  const { colors, spacing, radius, fonts, motion } = useTheme();
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: {
      minHeight: 44,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      fontSize: 14,
    },
    md: {
      minHeight: 48,
      paddingVertical: spacing.sm + 4,
      paddingHorizontal: spacing.lg,
      fontSize: 16,
    },
    lg: {
      minHeight: 54,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      fontSize: 16,
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
      borderColor: "transparent",
      borderWidth: 0,
      textColor: colors.onPrimary,
    },
    secondary: {
      backgroundColor: colors.secondarySurface,
      borderColor: colors.border,
      borderWidth: 1,
      textColor: colors.text,
    },
    ghost: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      borderWidth: 0,
      textColor: colors.textSecondary,
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  const handlePressIn = () => {
    if (isDisabled || reducedMotion) return;
    scale.set(
      withTiming(0.97, {
        duration: motion.fast,
        easing: PRESS_EASING,
      }),
    );
  };

  const handlePressOut = () => {
    if (reducedMotion) {
      scale.set(1);
      return;
    }
    scale.set(
      withTiming(1, {
        duration: motion.fast,
        easing: PRESS_EASING,
      }),
    );
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={4}
      pressRetentionOffset={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={({ pressed }) => [
        animatedStyle,
        {
          minHeight: currentSize.minHeight,
          minWidth: 44,
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
          backgroundColor:
            variant === "ghost" && pressed
              ? colors.ghostPressed
              : currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
          borderWidth: currentVariant.borderWidth,
          borderRadius: radius.sm,
          borderCurve: "continuous",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          alignSelf: fullWidth ? "stretch" : "auto",
          opacity: isDisabled ? 0.45 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
          <ActivityIndicator size="small" color={currentVariant.textColor} />
        </View>
      ) : (
        <Text
          style={{
            fontFamily: fonts.headingSemiBold,
            fontSize: currentSize.fontSize,
            lineHeight: 20,
            color: currentVariant.textColor,
          }}
        >
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
}
