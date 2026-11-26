import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme";

// safe area screen wrapper using atelier atlas background
export function Screen({
  children,
  edges = ["top", "bottom"],
  padded = false,
  style,
}) {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[
        {
          flex: 1,
          backgroundColor: colors.background,
          paddingHorizontal: padded ? spacing.lg : 0,
        },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}
