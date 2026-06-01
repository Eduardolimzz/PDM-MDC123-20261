import { useContext, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MoneyContext } from "../../contexts/GlobalState";
import SummaryItem from "../../components/SummaryItem";
import { globalStyles } from "../../styles/globalStyles";
import { colors } from "../../constants/colors";
import MonthYearFilter, {
  getDefaultMonthYear,
} from "../../components/MonthYearFilter";
import PieChart from "../../components/PieChart";

/**
 * Tela "Resumo".
 *
 * Itera sobre as categorias vindas do servidor (não há mais lista hardcoded)
 * e calcula:
 *  - totais por categoria (somatório dos `value` das transações da categoria);
 *  - saldo final = soma das transações de categorias `isIncome` menos as demais.
 *
 * @returns {JSX.Element}
 */
export default function Summary() {
  const { transactions, categories, loading } = useContext(MoneyContext);
  const [monthYear, setMonthYear] = useState(getDefaultMonthYear);

  const { totalsById, balance } = useMemo(() => {
    const acc = {};
    let saldo = 0;

    for (const c of categories) acc[c.id] = 0;

    const filtered = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === monthYear.year && d.getMonth() === monthYear.month;
    });

    for (const t of filtered) {
      const numericValue = Number(t.value);
      if (acc[t.categoryId] !== undefined) {
        acc[t.categoryId] += numericValue;
      }
      const cat = t.category ?? categories.find((c) => c.id === t.categoryId);
      if (cat?.isIncome) {
        saldo += numericValue;
      } else {
        saldo -= numericValue;
      }
    }
    return { totalsById: acc, balance: saldo };
  }, [transactions, categories, monthYear]);

  const chartData = useMemo(() => {
    return categories
      .filter((c) => !c.isIncome)
      .map((c) => ({
        label: c.displayName,
        value: totalsById[c.id] ?? 0,
        color: c.background,
      }))
      .filter((d) => d.value > 0);
  }, [categories, totalsById]);

  if (loading && categories.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const balanceStyle =
    balance >= 0 ? globalStyles.positiveText : globalStyles.negativeText;

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView style={globalStyles.content}>
        <MonthYearFilter value={monthYear} onChange={setMonthYear} />

        <View style={styles.chartWrap}>
          <PieChart data={chartData} size={200} />
          {chartData.length > 0 && (
            <Text style={styles.chartHint}>DistribuiÃ§Ã£o de gastos no perÃ­odo</Text>
          )}
        </View>

        {categories.map((category) => (
          <SummaryItem
            key={category.id}
            category={category}
            value={totalsById[category.id] ?? 0}
          />
        ))}
        <View style={globalStyles.line} />
        <View style={styles.balance}>
          <Text style={styles.balanceText}>Saldo</Text>
          <Text style={balanceStyle}>
            {balance.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrap: {
    marginBottom: 12,
  },
  chartHint: {
    marginTop: 6,
    textAlign: "center",
    color: colors.secondaryText,
  },
  balance: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceText: {
    fontSize: 18,
    color: colors.primaryText,
    fontWeight: "800",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
