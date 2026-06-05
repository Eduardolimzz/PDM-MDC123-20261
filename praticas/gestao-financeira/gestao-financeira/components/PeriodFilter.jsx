import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";
import { globalStyles } from "../styles/globalStyles";

const MONTHS = [
  { label: "Todos os meses", value: "" },
  { label: "Janeiro", value: "1" },
  { label: "Fevereiro", value: "2" },
  { label: "Março", value: "3" },
  { label: "Abril", value: "4" },
  { label: "Maio", value: "5" },
  { label: "Junho", value: "6" },
  { label: "Julho", value: "7" },
  { label: "Agosto", value: "8" },
  { label: "Setembro", value: "9" },
  { label: "Outubro", value: "10" },
  { label: "Novembro", value: "11" },
  { label: "Dezembro", value: "12" },
];

export function filterTransactionsByPeriod(transactions, filter) {
  return transactions.filter((transaction) => {
    const date = new Date(transaction.date);
    const monthOk =
      !filter.month || date.getMonth() + 1 === Number(filter.month);
    const yearOk =
      !filter.year || date.getFullYear() === Number(filter.year);
    return monthOk && yearOk;
  });
}

export default function PeriodFilter({ filter, setFilter }) {
  const clear = () => setFilter({ month: "", year: "" });

  return (
    <View style={[globalStyles.card, styles.container]}>
      <View style={styles.field}>
        <Text style={globalStyles.inputLabel}>Mês</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={filter.month}
            onValueChange={(month) => setFilter((prev) => ({ ...prev, month }))}
          >
            {MONTHS.map((month) => (
              <Picker.Item
                key={month.value}
                label={month.label}
                value={month.value}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.yearRow}>
        <View style={styles.yearField}>
          <Text style={globalStyles.inputLabel}>Ano</Text>
          <TextInput
            value={filter.year}
            onChangeText={(year) =>
              setFilter((prev) => ({
                ...prev,
                year: year.replace(/\D/g, "").slice(0, 4),
              }))
            }
            keyboardType="numeric"
            placeholder="2026"
            style={globalStyles.input}
          />
        </View>
        <TouchableOpacity onPress={clear} style={styles.clearButton}>
          <Text style={styles.clearText}>Limpar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 12,
    marginTop: 12,
  },
  field: {
    gap: 2,
  },
  pickerBox: {
    justifyContent: "center",
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.inputBackground,
  },
  yearRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  yearField: {
    flex: 1,
  },
  clearButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
  },
  clearText: {
    color: colors.primaryText,
    fontWeight: "700",
  },
});
