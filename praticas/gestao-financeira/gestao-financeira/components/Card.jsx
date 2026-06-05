import { View } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function Card({ children, style }) {
  return <View style={[globalStyles.card, style]}>{children}</View>;
}
