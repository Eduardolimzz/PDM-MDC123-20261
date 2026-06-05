import { StyleSheet, Text, TouchableHighlight } from "react-native";
import { colors } from "../constants/colors";

/**
 * Botão primário do app.
 *
 * @param {{ children: React.ReactNode, onPress: () => void, disabled?: boolean }} props
 * @returns {JSX.Element}
 */
export default function Button({ children, onPress, disabled = false, variant = "primary" }) {
  return (
    <TouchableHighlight
      style={[
        style.background,
        variant === "secondary" && style.secondary,
        disabled && style.disabled,
      ]}
      onPress={disabled ? undefined : onPress}
      underlayColor={variant === "secondary" ? colors.surfacePressed : colors.primary}
    >
      <Text style={[style.text, variant === "secondary" && style.secondaryText]}>
        {children}
      </Text>
    </TouchableHighlight>
  );
}

const style = StyleSheet.create({
  background: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceMuted,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: colors.primaryContrast,
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryText: {
    color: colors.primaryText,
  },
});
