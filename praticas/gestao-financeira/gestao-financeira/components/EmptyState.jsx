import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { globalStyles } from "../styles/globalStyles";

export default function EmptyState({ icon = "inbox", title, description }) {
  return (
    <View style={globalStyles.emptyState}>
      <View style={globalStyles.emptyIcon}>
        <MaterialIcons name={icon} size={32} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  description: {
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
