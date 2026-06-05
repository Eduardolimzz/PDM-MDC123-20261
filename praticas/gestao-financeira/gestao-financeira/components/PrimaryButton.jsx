import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../constants/colors";

export default function PrimaryButton({
  children,
  onPress,
  disabled = false,
  variant = "primary",
  style,
}) {
  const secondary = variant === "secondary";

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, secondary && styles.secondaryText]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  secondary: {
    backgroundColor: colors.surfaceMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.55,
  },
  text: {
    color: colors.primaryContrast,
    fontSize: 16,
    fontWeight: "900",
  },
  secondaryText: {
    color: colors.primaryText,
  },
});
