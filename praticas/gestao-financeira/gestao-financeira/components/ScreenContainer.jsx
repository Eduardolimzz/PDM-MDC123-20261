import { View } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function ScreenContainer({ children, style }) {
  return <View style={[globalStyles.screenContainer, style]}>{children}</View>;
}
