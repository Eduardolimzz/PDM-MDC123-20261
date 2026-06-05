import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import CategoryItem from "./CategoryItem";
import { colors } from "../constants/colors";

/**
 * Item de uma transação na lista (tela "Transações").
 *
 * Recebe a transação inteira (já com a categoria expandida pelo back-end)
 * e formata data/valor em português brasileiro.
 *
 * @param {{ category: object, date: string|Date, description: string, value: string|number }} props
 * @returns {JSX.Element}
 */
export default function TransactionItem({ category, date, description, value }) {
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
    <View
      style={[
        globalStyles.card,
        styles.card,
        { borderLeftColor: isIncome ? colors.positiveText : colors.negativeText },
      ]}
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
      <View style={styles.footerRow}>
        <Text style={styles.date}>
          {new Date(date).toLocaleDateString("pt-BR")}
        </Text>
        <Text
          style={[
            styles.badge,
            isIncome ? styles.incomeBadge : styles.expenseBadge,
          ]}
        >
          {isIncome ? "Receita" : "Despesa"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 5,
    padding: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  textContainer: {
    flex: 1,
    gap: 3,
  },
  description: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: "700",
  },
  value: {
    fontSize: 16,
    textAlign: "right",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingLeft: 56,
  },
  date: {
    color: colors.secondaryText,
    fontSize: 13,
    fontWeight: "500",
  },
  badge: {
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: "700",
  },
  incomeBadge: {
    color: colors.positiveText,
    backgroundColor: colors.positiveSoft,
  },
  expenseBadge: {
    color: colors.negativeText,
    backgroundColor: colors.negativeSoft,
  },
});
