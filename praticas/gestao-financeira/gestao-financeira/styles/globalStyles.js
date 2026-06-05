import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
  },
  cardPad: {
    padding: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
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
  screenTitle: {
    color: colors.primaryText,
    fontSize: 26,
    fontWeight: "900",
  },
  screenSubtitle: {
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 21,
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
    fontWeight: "800",
    marginBottom: 8,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.inputBackground,
    color: colors.primaryText,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    gap: 14,
  },
  modalTitle: {
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: "800",
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
  },
  dangerButton: {
    backgroundColor: colors.negativeSoft,
  },
  subtleButton: {
    backgroundColor: colors.primarySoft,
  },
  line: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
    gap: 10,
  },
  emptyIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceMuted,
    marginBottom: 4,
  },
});
