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
import { MaterialIcons } from "@expo/vector-icons";
import { MoneyContext } from "../../contexts/GlobalState";
import Button from "../../components/Button";
import CategoryItem from "../../components/CategoryItem";
import { globalStyles } from "../../styles/globalStyles";
import { colors } from "../../constants/colors";
import Card from "../../components/Card";

const PRESET_COLORS = [
  "#DE9AC3",
  "#DEA17B",
  "#E6E088",
  "#AB8FBE",
  "#82C9DE",
  "#FFB6B6",
  "#9ED9A9",
  "#F5C26B",
];

/**
 * Tela "Categorias".
 *
 * Permite listar, criar e excluir categorias. Categorias com `isDefault=true`
 * vêm do seed do back-end e não podem ser removidas — o servidor barra a
 * exclusão e a tela apenas oculta o botão de remover para essas linhas.
 *
 * @returns {JSX.Element}
 */
export default function CategoriesScreen() {
  const { categories, loading, refreshing, hydrated, refresh, addCategory, updateCategory, removeCategory } =
    useContext(MoneyContext);

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [icon, setIcon] = useState("label");
  const [background, setBackground] = useState(PRESET_COLORS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const resetForm = () => {
    setName("");
    setDisplayName("");
    setIcon("label");
    setBackground(PRESET_COLORS[0]);
  };

  const handleCreate = async () => {
    if (!name.trim() || name.trim().length < 2) {
      Alert.alert("Informe um identificador (mín. 2 letras, sem espaços).");
      return;
    }
    if (!displayName.trim() || displayName.trim().length < 2) {
      Alert.alert("Informe o nome de exibição (mín. 2 letras).");
      return;
    }
    if (!icon.trim()) {
      Alert.alert("Informe o nome do ícone (Material Icons).");
      return;
    }

    setSubmitting(true);
    try {
      await addCategory({
        name: name.trim().toLowerCase().replace(/\s+/g, "_"),
        displayName: displayName.trim(),
        icon: icon.trim(),
        background,
        isIncome: false,
      });
      resetForm();
      Alert.alert("Categoria criada!");
    } catch (e) {
      Alert.alert("Erro ao salvar", e.message ?? "Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (item) => {
    if (item.isDefault) {
      Alert.alert("Categoria padrão", "Categorias padrão não podem ser excluídas.");
      return;
    }

    const deleteItem = async () => {
      try {
        await removeCategory(item.id);
      } catch (e) {
        Alert.alert("Erro ao excluir", e.message ?? "Tente novamente.");
      }
    };

    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (window.confirm(`Deseja excluir "${item.displayName}"?`)) {
        deleteItem();
      }
      return;
    }

    Alert.alert(
      "Excluir categoria",
      `Deseja excluir "${item.displayName}"?`,
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
    if (!editing.displayName.trim() || !editing.icon.trim()) {
      Alert.alert("Confira nome de exibição e ícone.");
      return;
    }
    setSavingEdit(true);
    try {
      await updateCategory(editing.id, {
        displayName: editing.displayName.trim(),
        icon: editing.icon.trim(),
        background: editing.background,
        isIncome: editing.isIncome,
      });
      setEditing(null);
    } catch (e) {
      Alert.alert("Erro ao editar", e.message ?? "Tente novamente.");
    } finally {
      setSavingEdit(false);
    }
  };

  if (!hydrated && loading && categories.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <Card style={styles.heroCard}>
              <Text style={styles.heroTitle}>Categorias</Text>
              <Text style={styles.heroSubtitle}>
                Organize receitas e despesas com cores e ícones.
              </Text>
            </Card>
            <View style={[globalStyles.card, globalStyles.cardPad, styles.formContainer]}>
              <Text style={styles.sectionTitle}>Nova categoria</Text>

              <View>
                <Text style={globalStyles.inputLabel}>Identificador</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="ex.: health"
                  autoCapitalize="none"
                  style={globalStyles.input}
                />
              </View>

              <View>
                <Text style={globalStyles.inputLabel}>Nome de exibição</Text>
                <TextInput
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="ex.: Saúde"
                  style={globalStyles.input}
                />
              </View>

              

              <View>
                <Text style={globalStyles.inputLabel}>Cor</Text>
                <View style={styles.colorRow}>
                  {PRESET_COLORS.map((c) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setBackground(c)}
                      style={[
                        styles.colorDot,
                        { backgroundColor: c },
                        background === c && styles.colorDotSelected,
                      ]}
                    />
                  ))}
                </View>
              </View>

              <Button onPress={handleCreate} disabled={submitting}>
                {submitting ? "Salvando..." : "Adicionar categoria"}
              </Button>
            </View>

            <Text style={styles.sectionTitle}>Categorias cadastradas</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[globalStyles.card, styles.categoryRow]}>
            <CategoryItem category={item} />
            <View style={styles.categoryInfo}>
              <Text style={globalStyles.primaryText}>{item.displayName}</Text>
              <View style={styles.badgeRow}>
                <Text style={styles.badge}>
                  {item.isDefault ? "Padrão" : "Customizada"}
                </Text>
                <Text
                  style={[
                    styles.badge,
                    item.isIncome ? styles.incomeBadge : styles.expenseBadge,
                  ]}
                >
                  {item.isIncome ? "Receita" : "Despesa"}
                </Text>
              </View>
            </View>
            <View style={styles.actions}>
              {!item.isDefault ? (
                <>
                  <TouchableOpacity
                    onPress={() => setEditing({ ...item })}
                    style={[globalStyles.iconButton, globalStyles.subtleButton]}
                  >
                    <MaterialIcons name="edit" size={18} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item)}
                    style={[globalStyles.iconButton, globalStyles.dangerButton]}
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={20}
                      color={colors.negativeText}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.lockedText}>Protegida</Text>
              )}
            </View>
          </View>
        )}
      />
      <Modal
        visible={Boolean(editing)}
        transparent
        animationType="slide"
        onRequestClose={() => setEditing(null)}
      >
        <View style={globalStyles.modalBackdrop}>
          <View style={globalStyles.modalCard}>
            <Text style={globalStyles.modalTitle}>Editar categoria</Text>
            <View>
              <Text style={globalStyles.inputLabel}>Nome de exibição</Text>
              <TextInput
                value={editing?.displayName ?? ""}
                onChangeText={(displayName) =>
                  setEditing((prev) => ({ ...prev, displayName }))
                }
                style={globalStyles.input}
              />
            </View>
           
            <View>
              <Text style={globalStyles.inputLabel}>Tipo</Text>
              <View style={styles.typeRow}>
                <TouchableOpacity
                  onPress={() => setEditing((prev) => ({ ...prev, isIncome: false }))}
                  style={[
                    styles.typeButton,
                    !editing?.isIncome && styles.typeButtonActive,
                  ]}
                >
                  <Text style={!editing?.isIncome ? styles.typeTextActive : styles.typeText}>
                    Despesa
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setEditing((prev) => ({ ...prev, isIncome: true }))}
                  style={[
                    styles.typeButton,
                    editing?.isIncome && styles.typeButtonActive,
                  ]}
                >
                  <Text style={editing?.isIncome ? styles.typeTextActive : styles.typeText}>
                    Receita
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={globalStyles.inputLabel}>Cor</Text>
              <View style={styles.colorRow}>
                {PRESET_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() =>
                      setEditing((prev) => ({ ...prev, background: c }))
                    }
                    style={[
                      styles.colorDot,
                      { backgroundColor: c },
                      editing?.background === c && styles.colorDotSelected,
                    ]}
                  />
                ))}
              </View>
            </View>
            <View style={styles.modalActions}>
              <Button variant="secondary" onPress={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button onPress={handleSaveEdit} disabled={savingEdit}>
                {savingEdit ? "Salvando..." : "Salvar"}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 18,
    paddingBottom: 104,
    paddingHorizontal: 18,
    gap: 14,
  },
  formContainer: {
    gap: 14,
    marginVertical: 14,
  },
  headerContent: {
    gap: 4,
  },
  heroCard: {
    padding: 18,
    gap: 6,
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.primaryText,
    marginTop: 4,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 20,
  },
  categoryInfo: {
    flex: 1,
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: "transparent",
  },
  colorDotSelected: {
    borderColor: colors.primary,
    transform: [{ scale: 1.08 }],
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  badge: {
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.surfaceMuted,
    color: colors.secondaryText,
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
  actions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  lockedText: {
    color: colors.warningText,
    fontSize: 12,
    fontWeight: "900",
    backgroundColor: colors.warningSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
  },
  typeButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
  },
  typeText: {
    color: colors.primaryText,
    fontWeight: "700",
  },
  typeTextActive: {
    color: colors.primaryContrast,
    fontWeight: "700",
  },
  modalActions: {
    gap: 10,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
