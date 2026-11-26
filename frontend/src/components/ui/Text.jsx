import { Text as RNText } from "react-native";
import { useTheme } from "@/theme";

// themed text component using atelier atlas typography tokens
export function Text({
  variant = "body",
  color,
  align,
  style,
  children,
  ...rest
}) {
  const { colors, typography } = useTheme();
  const variantStyle = typography[variant] || typography.body;

  const resolvedColor =
    color === "secondary"
      ? colors.textSecondary
      : color === "primary"
        ? colors.primary
        : color === "accent"
          ? colors.accent
          : color === "onPrimary"
            ? colors.onPrimary
            : color || colors.text;

  return (
    <RNText
      style={[
        variantStyle,
        { color: resolvedColor },
        align ? { textAlign: align } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
