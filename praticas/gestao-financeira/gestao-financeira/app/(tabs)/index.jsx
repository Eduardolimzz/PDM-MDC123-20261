import { useContext, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MoneyContext } from "../../contexts/GlobalState";
import TransactionItem from "../../components/TransactionItem";
import { globalStyles } from "../../styles/globalStyles";
import { colors } from "../../constants/colors";
import MonthYearFilter, {
  getDefaultMonthYear,
} from "../../components/MonthYearFilter";
import { AuthContext } from "../../contexts/AuthState";
import Button from "../../components/Button";
import DatePicker from "../../components/DatePicker";
import CategoryPicker from "../../components/CategoryPicker";

/**
 * Tela "TransaÃ§Ãµes".
 *
 * Lista as transaÃ§Ãµes vindas do servidor, com:
 *  - filtro de mÃªs/ano,
 *  - pull-to-refresh,
 *  - long-press abre modal para editar/excluir.
 *
 * @returns {JSX.Element}
 */
export default function Transactions() {
  const {
    transactions,
    categories,
    loading,
    error,
    refresh,
    removeTransaction,
    updateTransaction,
  } = useContext(MoneyContext);
  const { user, logout } = useContext(AuthContext);

  const [monthYear, setMonthYear] = useState(getDefaultMonthYear);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const filteredTransactions = useMemo(() => {
    const { month, year } = monthYear;
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [transactions, monthYear]);

  const openEdit = (item) => {
    setEditing(item);
    setEditForm({
      description: item.description ?? "",
      value: Number(item.value) || 0,
      date: new Date(item.date),
      categoryId: item.categoryId,
    });
  };

  if (loading && transactions.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={globalStyles.secondaryText}>Carregando transaÃ§Ãµes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <Text style={globalStyles.primaryText}>NÃ£o foi possÃ­vel carregar.</Text>
        <Text style={globalStyles.secondaryText}>{error}</Text>
        <TouchableOpacity onPress={refresh} style={styles.retry}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStyles.screenContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>
            Bem-vindo{user?.name ? `, ${user.name}` : ""}!
          </Text>
          <Text style={styles.subtitle}>Gerencie suas transaÃ§Ãµes do mÃªs</Text>
        </View>
        <TouchableOpacity onPress={logout} hitSlop={8} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <MonthYearFilter value={monthYear} onChange={setMonthYear} />

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => openEdit(item)} activeOpacity={0.7}>
            <TransactionItem {...item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={globalStyles.secondaryText}>
            NÃ£o hÃ¡ transaÃ§Ãµes neste mÃªs. Adicione na aba do meio.
          </Text>
        }
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        contentContainerStyle={styles.listContent}
      />

      <Modal
        visible={!!editing}
        animationType="slide"
        transparent
        onRequestClose={() => setEditing(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar transaÃ§Ã£o</Text>

            {editForm && (
              <View style={styles.modalForm}>
                <View>
                  <Text style={globalStyles.inputLabel}>DescriÃ§Ã£o</Text>
                  <TextInput
                    value={editForm.description}
                    onChangeText={(description) =>
                      setEditForm((p) => ({ ...p, description }))
                    }
                    style={globalStyles.input}
                  />
                </View>

                <View>
                  <Text style={globalStyles.inputLabel}>Valor</Text>
                  <TextInput
                    value={String(editForm.value)}
                    onChangeText={(text) => {
                      const parsed = Number(String(text).replace(",", "."));
                      setEditForm((p) => ({
                        ...p,
                        value: Number.isFinite(parsed) ? parsed : 0,
                      }));
                    }}
                    keyboardType="numeric"
                    style={globalStyles.input}
                  />
                </View>

                <DatePicker form={editForm} setForm={setEditForm} />
                <CategoryPicker form={editForm} setForm={setEditForm} categories={categories} />

                <Button
                  onPress={async () => {
                    try {
                      if (!editForm.description.trim()) {
                        Alert.alert("Informe a descriÃ§Ã£o.");
                        return;
                      }
                      if (!editForm.value || editForm.value <= 0) {
                        Alert.alert("Informe um valor maior que zero.");
                        return;
                      }
                      await updateTransaction(editing.id, {
                        description: editForm.description.trim(),
                        value: editForm.value,
                        date: editForm.date,
                        categoryId: editForm.categoryId,
                      });
                      setEditing(null);
                    } catch (e) {
                      Alert.alert("Erro ao salvar", e.message ?? "Tente novamente.");
                    }
                  }}
                >
                  Salvar alteraÃ§Ãµes
                </Button>

                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Excluir transaÃ§Ã£o",
                      `Deseja excluir "${editing.description}"?`,
                      [
                        { text: "Cancelar", style: "cancel" },
                        {
                          text: "Excluir",
                          style: "destructive",
                          onPress: async () => {
                            try {
                              await removeTransaction(editing.id);
                              setEditing(null);
                            } catch (e) {
                              Alert.alert("Erro ao excluir", e.message ?? "Tente novamente.");
                            }
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Text style={styles.delete}>Excluir transaÃ§Ã£o</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setEditing(null)}>
                  <Text style={styles.cancel}>Fechar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  welcome: { color: colors.primaryText, fontSize: 16, fontWeight: "800" },
  subtitle: { color: colors.secondaryText, marginTop: 2 },
  logoutBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  logoutText: { color: colors.primaryContrast, fontWeight: "800" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
  },
  retry: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: colors.primaryContrast,
    fontWeight: "600",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primaryText,
    marginBottom: 12,
  },
  modalForm: { gap: 12 },
  delete: {
    textAlign: "center",
    color: colors.negativeText,
    fontWeight: "800",
    marginTop: 4,
  },
  cancel: {
    textAlign: "center",
    color: colors.secondaryText,
    fontWeight: "700",
    marginTop: 2,
  },
});

