import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useContext, useMemo, useRef, useState } from "react";
import { globalStyles } from "../../styles/globalStyles";
import Button from "../../components/Button";
import DescriptionInput from "../../components/DescriptionInput";
import CurrencyInput from "../../components/CurrencyInput";
import DatePicker from "../../components/DatePicker";
import CategoryPicker from "../../components/CategoryPicker";
import { MoneyContext } from "../../contexts/GlobalState";
import { colors } from "../../constants/colors";
import Card from "../../components/Card";

/**
 * Tela "Adicionar Transação".
 *
 * O formulário escolhe a categoria padrão de forma dinâmica (a primeira
 * `isIncome` ou, na ausência, a primeira da lista). Em caso de falha de
 * rede, exibe Alert e mantém o formulário preenchido para o usuário tentar
 * novamente.
 *
 * @returns {JSX.Element}
 */
export default function AddTransactions() {
  const { categories, loading, hydrated, addTransaction } = useContext(MoneyContext);
  const valueInputRef = useRef();

  const defaultCategoryId = useMemo(() => {
    if (categories.length === 0) return "";
    const income = categories.find((c) => c.isIncome);
    return income ? income.id : categories[0].id;
  }, [categories]);

  const buildInitialForm = () => ({
    description: "",
    value: 0,
    date: new Date(),
    categoryId: defaultCategoryId,
  });

  const [form, setForm] = useState(buildInitialForm);
  const [submitting, setSubmitting] = useState(false);

  // mantém o categoryId default coerente com a lista carregada
  if (!form.categoryId && defaultCategoryId) {
    setForm((prev) => ({ ...prev, categoryId: defaultCategoryId }));
  }

  const handleAdd = async () => {
    if (!form.description.trim()) {
      Alert.alert("Informe a descrição.");
      return;
    }
    if (!form.value || form.value <= 0) {
      Alert.alert("Informe um valor maior que zero.");
      return;
    }
    if (!form.categoryId) {
      Alert.alert("Selecione uma categoria.");
      return;
    }

    setSubmitting(true);
    try {
      await addTransaction({
        description: form.description.trim(),
        value: form.value,
        date: form.date,
        categoryId: form.categoryId,
      });
      setForm(buildInitialForm());
      Alert.alert("Transação adicionada com sucesso!");
    } catch (e) {
      Alert.alert("Erro ao salvar", e.message ?? "Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated && loading) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={globalStyles.secondaryText}>Carregando categorias...</Text>
      </View>
    );
  }

  if (categories.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <Text style={globalStyles.primaryText}>
          Nenhuma categoria cadastrada.
        </Text>
        <Text style={globalStyles.secondaryText}>
          Vá até a aba &quot;Categorias&quot; para criar a primeira.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={globalStyles.screenContainer}>
        <ScrollView
          style={globalStyles.content}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <Card style={styles.header}>
            <Text style={styles.heroTitle}>Nova transação</Text>
            <Text style={styles.heroSubtitle}>
              Registre uma receita ou despesa usando as categorias do backend.
            </Text>
          </Card>
          <View style={[globalStyles.card, globalStyles.cardPad, styles.form]}>
            <View style={styles.formSection}>
              <DescriptionInput
                form={form}
                setForm={setForm}
                valueInputRef={valueInputRef}
              />
              <CurrencyInput
                form={form}
                setForm={setForm}
                valueInputRef={valueInputRef}
              />
            </View>
            <View style={styles.formSection}>
              <DatePicker form={form} setForm={setForm} />
              <CategoryPicker
                form={form}
                setForm={setForm}
                categories={categories}
              />
            </View>
            <Button onPress={handleAdd} disabled={submitting}>
              {submitting ? "Salvando..." : "Adicionar transação"}
            </Button>
          </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
    marginBottom: 14,
    padding: 18,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  heroTitle: {
    color: colors.primaryContrast,
    fontSize: 28,
    fontWeight: "900",
  },
  heroSubtitle: {
    color: "#EDE9FE",
    fontSize: 14,
    lineHeight: 20,
  },
  scrollContent: {
    paddingBottom: 104,
  },
  form: {
    gap: 20,
    marginBottom: 32,
    borderRadius: 20,
  },
  formSection: {
    gap: 14,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
  },
});
