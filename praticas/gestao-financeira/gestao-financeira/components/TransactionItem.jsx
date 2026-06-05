import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import CategoryItem from "./CategoryItem";
import { colors } from "../constants/colors";
import Card from "./Card";

/**
 * Item de uma transação na lista (tela "Transações").
 *
 * Recebe a transação inteira (já com a categoria expandida pelo back-end)
 * e formata data/valor em português brasileiro.
 *
 * @param {{ category: object, date: string|Date, description: string, value: string|number }} props
 * @returns {JSX.Element}
 */
export default function TransactionItem({
  category,
  date,
  description,
  value,
  onEdit,
  onDelete,
  onLongPress,
}) {
  const numericValue = Number(value);
  const isIncome = Boolean(category?.isIncome);
  const valueStyle = category?.isIncome
    ? globalStyles.positiveText
    : globalStyles.negativeText;
  const signedValue = `${isIncome ? "+" : "-"} ${numericValue.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  )}`;

  return (
    <Card
      style={[
        styles.card,
        { borderLeftColor: isIncome ? colors.positiveText : colors.negativeText },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={onLongPress}
        style={styles.touchArea}
      >
        <View style={styles.headerRow}>
          <CategoryItem category={category} />
          <View style={styles.textContainer}>
            <Text style={styles.description} numberOfLines={1}>
              {description}
            </Text>
            <Text style={globalStyles.secondaryText} numberOfLines={1}>
              {category?.displayName ?? "Sem categoria"}
            </Text>
          </View>
          <Text style={[valueStyle, styles.value]}>{signedValue}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.footerRow}>
        <Text style={styles.date}>
          {new Date(date).toLocaleDateString("pt-BR")}
        </Text>
        <View style={styles.actions}>
          <Text
            style={[
              styles.badge,
              isIncome ? styles.incomeBadge : styles.expenseBadge,
            ]}
          >
            {isIncome ? "Receita" : "Despesa"}
          </Text>
          <TouchableOpacity
            onPress={onEdit}
            activeOpacity={0.75}
            style={[styles.actionButton, styles.editButton]}
            hitSlop={6}
          >
            <MaterialIcons name="edit" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            activeOpacity={0.75}
            style={[styles.actionButton, styles.deleteButton]}
            hitSlop={6}
          >
            <MaterialIcons
              name="delete-outline"
              size={19}
              color={colors.negativeText}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 5,
    padding: 16,
    marginBottom: 2,
  },
  touchArea: {
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  textContainer: {
    flex: 1,
    gap: 5,
  },
  description: {
    color: colors.primaryText,
    fontSize: 17,
    fontWeight: "900",
  },
  value: {
    fontSize: 17,
    fontWeight: "900",
    textAlign: "right",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingLeft: 68,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  date: {
    color: colors.secondaryText,
    fontSize: 13,
    fontWeight: "700",
  },
  badge: {
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: "900",
  },
  incomeBadge: {
    color: colors.positiveText,
    backgroundColor: colors.positiveSoft,
  },
  expenseBadge: {
    color: colors.negativeText,
    backgroundColor: colors.negativeSoft,
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  editButton: {
    backgroundColor: colors.primarySoft,
  },
  deleteButton: {
    backgroundColor: colors.negativeSoft,
  },
});
