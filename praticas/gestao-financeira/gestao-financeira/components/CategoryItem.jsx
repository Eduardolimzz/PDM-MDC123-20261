import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { colors } from "../constants/colors";

/**
 * Bolinha colorida que representa visualmente uma categoria.
 *
 * @param {{ category: { icon: string, background: string } }} props
 * @returns {JSX.Element}
 */
export default function CategoryItem({ category }) {
  return (
    <View style={styles.ring}>
      <View style={[styles.background, { backgroundColor: category.background }]}>
      <MaterialIcons
        name={category.icon}
        size={24}
        color={colors.primaryContrast}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: "center",
    justifyContent: "center",
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.surfaceMuted,
  },
  background: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 46,
    height: 46,
    borderRadius: 23,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
});
