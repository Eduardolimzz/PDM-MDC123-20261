import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { colors } from "../constants/colors";

const MONTHS = [
  { value: 0, label: "Janeiro" },
  { value: 1, label: "Fevereiro" },
  { value: 2, label: "MarÃ§o" },
  { value: 3, label: "Abril" },
  { value: 4, label: "Maio" },
  { value: 5, label: "Junho" },
  { value: 6, label: "Julho" },
  { value: 7, label: "Agosto" },
  { value: 8, label: "Setembro" },
  { value: 9, label: "Outubro" },
  { value: 10, label: "Novembro" },
  { value: 11, label: "Dezembro" },
];

export function getDefaultMonthYear() {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}

export default function MonthYearFilter({ value, onChange, minYear = 2020 }) {
  const years = useMemo(() => {
    const current = new Date().getFullYear();
    const list = [];
    for (let y = current + 1; y >= minYear; y -= 1) list.push(y);
    return list;
  }, [minYear]);

  return (
    <View style={styles.container}>
      <View style={styles.pickerWrap}>
        <Text style={styles.label}>MÃªs</Text>
        <View style={styles.pickerBorder}>
          <Picker
            selectedValue={value.month}
            onValueChange={(month) => onChange({ ...value, month })}
          >
            {MONTHS.map((m) => (
              <Picker.Item key={m.value} value={m.value} label={m.label} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.pickerWrap}>
        <Text style={styles.label}>Ano</Text>
        <View style={styles.pickerBorder}>
          <Picker
            selectedValue={value.year}
            onValueChange={(year) => onChange({ ...value, year })}
          >
            {years.map((y) => (
              <Picker.Item key={y} value={y} label={String(y)} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  pickerWrap: { flex: 1 },
  label: { color: colors.secondaryText, fontSize: 12, marginBottom: 6 },
  pickerBorder: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    overflow: "hidden",
  },
});

