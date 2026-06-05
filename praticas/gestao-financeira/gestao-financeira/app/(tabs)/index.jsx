import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MoneyContext } from "../../contexts/GlobalState";
import TransactionItem from "../../components/TransactionItem";
import PeriodFilter, {
  filterTransactionsByPeriod,
} from "../../components/PeriodFilter";
import EmptyState from "../../components/EmptyState";
import Card from "../../components/Card";
import { globalStyles } from "../../styles/globalStyles";
import { colors } from "../../constants/colors";

/**
 * Tela "Transações".
 *
 * Lista as transações vindas do servidor, com:
 *  - estado de carregamento inicial,
 *  - mensagem de erro com botão de "Tentar novamente",
 *  - pull-to-refresh,
 *  - long-press para excluir.
 *
 * @returns {JSX.Element}
 */
export default function Transactions() {
  const {
    transactions,
    categories,
    user,
    loading,
    refreshing,
    hydrated,
    error,
    refresh,
    updateTransaction,
    removeTransaction,
    logout,
  } =
    useContext(MoneyContext);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState({ month: "", year: "" });
  const filteredTransactions = filterTransactionsByPeriod(transactions, filter);

  const openEdit = (item) => {
    setEditing({
      ...item,
      value: String(Number(item.value).toFixed(2)).replace(".", ","),
      date: new Date(item.date).toISOString().slice(0, 10),
      categoryId: item.categoryId,
    });
  };

  const handleLongPress = (item) => {
    handleDelete(item);
  };

  const handleDelete = (item) => {
    const deleteItem = async () => {
      try {
        await removeTransaction(item.id);
      } catch (e) {
        Alert.alert("Erro ao excluir", e.message ?? "Tente novamente.");
      }
    };

    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (window.confirm(`Deseja excluir "${item.description}"?`)) {
        deleteItem();
      }
      return;
    }

    Alert.alert(
      "Excluir transação",
      `Deseja excluir "${item.description}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: deleteItem,
        },
      ],
      { cancelable: true }
    );
  };

  const handleSaveEdit = async () => {
    const value = Number(String(editing.value).replace(",", "."));
    if (!editing.description.trim() || !value || value <= 0) {
      Alert.alert("Confira descrição e valor.");
      return;
    }
    setSaving(true);
    try {
      await updateTransaction(editing.id, {
        description: editing.description.trim(),
        value,
        date: editing.date,
        categoryId: editing.categoryId,
      });
      setEditing(null);
    } catch (e) {
      Alert.alert("Erro ao editar", e.message ?? "Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (!hydrated && loading && transactions.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={globalStyles.secondaryText}>Carregando transações...</Text>
      </View>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <Text style={globalStyles.primaryText}>
          Não foi possível carregar.
        </Text>
        <Text style={globalStyles.secondaryText}>{error}</Text>
        <TouchableOpacity onPress={refresh} style={styles.retry}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Card style={styles.heroCard}>
              <View style={styles.userRow}>
              <Text style={styles.welcome}>Olá, {user?.name}!</Text>
              <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Sair</Text>
              </TouchableOpacity>
              </View>
              <Text style={styles.heroTitle}>Transações</Text>
              <Text style={styles.heroSubtitle}>
                Acompanhe receitas e despesas salvas no backend.
              </Text>
            </Card>
            {error && (
              <Text style={styles.inlineError}>
                Não foi possível atualizar agora. Os últimos dados seguem na tela.
              </Text>
            )}
            <PeriodFilter filter={filter} setFilter={setFilter} />
          </View>
        }
        renderItem={({ item }) => (
          <TransactionItem
            {...item}
            onLongPress={() => handleLongPress(item)}
            onEdit={() => openEdit(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-long"
            title="Nenhuma transação ainda"
            description="Use a aba central para registrar sua primeira receita ou despesa."
          />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
      />
      <Modal
        visible={Boolean(editing)}
        transparent
        animationType="slide"
        onRequestClose={() => setEditing(null)}
      >
        <View style={globalStyles.modalBackdrop}>
          <View style={globalStyles.modalCard}>
            <Text style={globalStyles.modalTitle}>Editar transação</Text>
            <View>
              <Text style={globalStyles.inputLabel}>Descrição</Text>
              <TextInput
                value={editing?.description ?? ""}
                onChangeText={(description) =>
                  setEditing((prev) => ({ ...prev, description }))
                }
                style={globalStyles.input}
              />
            </View>
            <View style={styles.modalGrid}>
              <View style={styles.modalField}>
                <Text style={globalStyles.inputLabel}>Valor</Text>
                <TextInput
                  value={editing?.value ?? ""}
                  onChangeText={(value) =>
                    setEditing((prev) => ({ ...prev, value }))
                  }
                  keyboardType="decimal-pad"
                  style={globalStyles.input}
                />
              </View>
              <View style={styles.modalField}>
                <Text style={globalStyles.inputLabel}>Data</Text>
                <TextInput
                  value={editing?.date ?? ""}
                  onChangeText={(date) =>
                    setEditing((prev) => ({ ...prev, date }))
                  }
                  placeholder="AAAA-MM-DD"
                  style={globalStyles.input}
                />
              </View>
            </View>
            <View>
              <Text style={globalStyles.inputLabel}>Categoria</Text>
              <View style={styles.categoryChips}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() =>
                      setEditing((prev) => ({
                        ...prev,
                        categoryId: category.id,
                      }))
                    }
                    style={[
                      styles.categoryChip,
                      editing?.categoryId === category.id &&
                        styles.categoryChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        editing?.categoryId === category.id &&
                          styles.categoryChipTextActive,
                      ]}
                    >
                      {category.displayName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setEditing(null)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveEdit}
                disabled={saving}
                style={[styles.modalButton, styles.saveButton, saving && styles.disabled]}
              >
                <Text style={styles.saveText}>
                  {saving ? "Salvando..." : "Salvar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 14,
    gap: 8,
  },
  heroCard: {
    padding: 18,
    gap: 6,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  welcome: {
    color: colors.primarySoft,
    fontSize: 15,
    fontWeight: "800",
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  logoutText: {
    color: colors.primaryContrast,
    fontSize: 13,
    fontWeight: "800",
  },
  heroTitle: {
    color: colors.primaryContrast,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 8,
  },
  heroSubtitle: {
    color: "#EDE9FE",
    fontSize: 14,
    lineHeight: 20,
  },
  listContent: {
    paddingTop: 18,
    paddingBottom: 104,
    paddingHorizontal: 18,
    gap: 16,
  },
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
  modalGrid: {
    flexDirection: "row",
    gap: 10,
  },
  modalField: {
    flex: 1,
  },
  categoryChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryChipText: {
    color: colors.primaryText,
    fontWeight: "600",
  },
  categoryChipTextActive: {
    color: colors.primaryContrast,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  modalButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: colors.surfaceMuted,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  disabled: {
    opacity: 0.65,
  },
  cancelText: {
    color: colors.primaryText,
    fontWeight: "700",
  },
  saveText: {
    color: colors.primaryContrast,
    fontWeight: "700",
  },
  inlineError: {
    color: colors.negativeText,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
  },
});
