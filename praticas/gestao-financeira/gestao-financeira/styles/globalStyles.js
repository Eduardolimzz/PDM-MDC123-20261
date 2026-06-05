import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  primaryText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryText: {
    color: colors.secondaryText,
    fontSize: 14,
  },
  positiveText: {
    color: colors.positiveText,
    fontSize: 16,
    fontWeight: "700",
  },
  negativeText: {
    color: colors.negativeText,
    fontSize: 16,
    fontWeight: "700",
  },
  inputLabel: {
    color: colors.primaryText,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
    color: colors.primaryText,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  line: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
});
