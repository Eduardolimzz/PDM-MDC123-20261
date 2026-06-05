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
import PeriodFilter, {
  filterTransactionsByPeriod,
} from "../../components/PeriodFilter";
import { globalStyles } from "../../styles/globalStyles";
import { colors } from "../../constants/colors";

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
  const { transactions, categories, loading, hydrated } = useContext(MoneyContext);
  const [filter, setFilter] = useState({ month: "", year: "" });
  const filteredTransactions = filterTransactionsByPeriod(transactions, filter);

  const { totalsById, balance, incomeTotal, expenseTotal, chartItems } = useMemo(() => {
    const acc = {};
    let saldo = 0;
    let receitas = 0;
    let despesas = 0;

    for (const c of categories) acc[c.id] = 0;

    for (const t of filteredTransactions) {
      const numericValue = Number(t.value);
      if (acc[t.categoryId] !== undefined) {
        acc[t.categoryId] += numericValue;
      }
      const cat = t.category ?? categories.find((c) => c.id === t.categoryId);
      if (cat?.isIncome) {
        saldo += numericValue;
        receitas += numericValue;
      } else {
        saldo -= numericValue;
        despesas += numericValue;
      }
    }
    const maxValue = Math.max(...Object.values(acc), 0);
    const chart = categories
      .map((category) => ({
        category,
        value: acc[category.id] ?? 0,
        percent: maxValue ? ((acc[category.id] ?? 0) / maxValue) * 100 : 0,
      }))
      .filter((item) => item.value > 0);

    return {
      totalsById: acc,
      balance: saldo,
      incomeTotal: receitas,
      expenseTotal: despesas,
      chartItems: chart,
    };
  }, [filteredTransactions, categories]);

  if (!hydrated && loading && categories.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const balanceStyle =
    balance >= 0 ? styles.balancePositive : styles.balanceNegative;

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView style={globalStyles.content}>
        <Text style={globalStyles.screenTitle}>Resumo</Text>
        <Text style={globalStyles.screenSubtitle}>
          Totais calculados com os dados carregados da API.
        </Text>
        <PeriodFilter filter={filter} setFilter={setFilter} />
        <View style={[globalStyles.card, styles.balanceCard]}>
          <Text style={styles.balanceLabel}>Saldo atual</Text>
          <Text style={balanceStyle}>
            {balance.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
          <Text style={globalStyles.screenSubtitle}>
            Calculado com as transações cadastradas.
          </Text>
        </View>

        <View style={styles.totalGrid}>
          <View style={[globalStyles.card, styles.totalCard]}>
            <Text style={styles.totalLabel}>Receitas</Text>
            <Text style={globalStyles.positiveText}>
              {incomeTotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>
          <View style={[globalStyles.card, styles.totalCard]}>
            <Text style={styles.totalLabel}>Despesas</Text>
            <Text style={globalStyles.negativeText}>
              {expenseTotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Por categoria</Text>
        <View style={[globalStyles.card, styles.chartCard]}>
          <Text style={styles.chartTitle}>Distribuição visual</Text>
          {chartItems.length === 0 ? (
            <Text style={globalStyles.secondaryText}>
              Sem dados para o período selecionado.
            </Text>
          ) : (
            chartItems.map(({ category, value, percent }) => (
              <View key={category.id} style={styles.chartRow}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartLabel}>{category.displayName}</Text>
                  <Text style={styles.chartValue}>
                    {value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${Math.max(percent, 6)}%`,
                        backgroundColor: category.background,
                      },
                    ]}
                  />
                </View>
              </View>
            ))
          )}
        </View>
        <View style={styles.categoryList}>
          {categories.map((category) => (
            <View key={category.id} style={[globalStyles.card, styles.categoryCard]}>
              <SummaryItem
                category={category}
                value={totalsById[category.id] ?? 0}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    padding: 18,
    gap: 6,
    marginBottom: 12,
  },
  balanceLabel: {
    color: colors.secondaryText,
    fontSize: 14,
    fontWeight: "700",
  },
  balancePositive: {
    color: colors.positiveText,
    fontSize: 28,
    fontWeight: "900",
  },
  balanceNegative: {
    color: colors.negativeText,
    fontSize: 28,
    fontWeight: "900",
  },
  totalGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  totalCard: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  totalLabel: {
    color: colors.secondaryText,
    fontSize: 13,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 16,
    color: colors.primaryText,
    fontWeight: "800",
    marginBottom: 10,
    marginTop: 4,
  },
  chartCard: {
    padding: 14,
    gap: 12,
    marginBottom: 12,
  },
  chartTitle: {
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: "800",
  },
  chartRow: {
    gap: 6,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  chartLabel: {
    flex: 1,
    color: colors.primaryText,
    fontSize: 13,
    fontWeight: "700",
  },
  chartValue: {
    color: colors.secondaryText,
    fontSize: 13,
    fontWeight: "700",
  },
  barTrack: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
  },
  categoryList: {
    gap: 10,
    paddingBottom: 24,
  },
  categoryCard: {
    padding: 14,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
