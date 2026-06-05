import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

export default function SectionTitle({ title, subtitle, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  title: {
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: 13,
    lineHeight: 19,
  },
});
