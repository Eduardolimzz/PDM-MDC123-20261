import { useContext } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MoneyContext } from "../../contexts/GlobalState";
import TransactionItem from "../../components/TransactionItem";
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
  const { transactions, loading, error, refresh, removeTransaction } =
    useContext(MoneyContext);

  const handleLongPress = (item) => {
    Alert.alert(
      "Excluir transação",
      `Deseja excluir "${item.description}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await removeTransaction(item.id);
            } catch (e) {
              Alert.alert("Erro ao excluir", e.message ?? "Tente novamente.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading && transactions.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={globalStyles.secondaryText}>Carregando transações...</Text>
      </View>
    );
  }

  if (error) {
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
        data={transactions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={globalStyles.screenTitle}>Transações</Text>
            <Text style={globalStyles.screenSubtitle}>
              Acompanhe receitas e despesas salvas no backend.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => handleLongPress(item)}
            activeOpacity={0.82}
          >
            <TransactionItem {...item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={globalStyles.emptyState}>
            <View style={globalStyles.emptyIcon}>
              <MaterialIcons
                name="receipt-long"
                size={32}
                color={colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>Nenhuma transação ainda</Text>
            <Text style={styles.emptyText}>
              Use a aba central para registrar sua primeira receita ou despesa.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 12,
    gap: 4,
  },
  listContent: {
    paddingTop: 18,
    paddingBottom: 28,
    paddingHorizontal: 20,
    gap: 14,
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
  emptyTitle: {
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  emptyText: {
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
