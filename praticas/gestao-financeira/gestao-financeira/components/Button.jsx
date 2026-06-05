import PrimaryButton from "./PrimaryButton";

/**
 * Botão primário do app.
 *
 * @param {{ children: React.ReactNode, onPress: () => void, disabled?: boolean }} props
 * @returns {JSX.Element}
 */
export default function Button({ children, onPress, disabled = false, variant = "primary" }) {
  return (
    <PrimaryButton onPress={onPress} disabled={disabled} variant={variant}>
      {children}
    </PrimaryButton>
  );
}
