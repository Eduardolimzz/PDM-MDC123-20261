import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { api } from "../services/api";

export const MoneyContext = createContext();

const stateCache = {
  hydrated: false,
  categories: [],
  transactions: [],
  initialLoad: null,
};

/**
 * Provider global do app.
 *
 * Centraliza:
 *  - hidratação inicial das categorias e transações a partir da API REST;
 *  - estado de carregamento e erro de rede;
 *  - ações para criar/excluir transações e categorias mantendo o estado em sync.
 *
 * O estado **não** é mais persistido em AsyncStorage. A fonte de verdade é o
 * banco MySQL exposto pela API (`gestao-financeira-api/`).
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element} Provider com o objeto de contexto exposto via `MoneyContext`.
 */
export default function GlobalState({ children }) {
  const [transactions, setTransactions] = useState(stateCache.transactions);
  const [categories, setCategories] = useState(stateCache.categories);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hydrated, setHydrated] = useState(stateCache.hydrated);
  const [error, setError] = useState(null);
  const hydratedRef = useRef(stateCache.hydrated);

  const syncFromCache = useCallback(() => {
    setCategories(stateCache.categories);
    setTransactions(stateCache.transactions);
    hydratedRef.current = stateCache.hydrated;
    setHydrated(stateCache.hydrated);
  }, []);

  const loadInitialData = useCallback(async () => {
    if (stateCache.hydrated) {
      syncFromCache();
      return;
    }

    if (!stateCache.initialLoad) {
      stateCache.initialLoad = Promise.all([
        api.listCategories(),
        api.listTransactions(),
      ]).then(([cats, txs]) => {
        stateCache.categories = cats;
        stateCache.transactions = txs;
        stateCache.hydrated = true;
        return { cats, txs };
      });
    }

    setLoading(true);
    setError(null);
    try {
      const { cats, txs } = await stateCache.initialLoad;
      setCategories(cats);
      setTransactions(txs);
      hydratedRef.current = true;
      setHydrated(true);
    } catch (e) {
      stateCache.initialLoad = null;
      setError(e.message ?? "Falha ao carregar dados do servidor");
    } finally {
      setLoading(false);
    }
  }, [syncFromCache]);

  /**
   * Recarrega categorias e transações apenas quando o usuário pede refresh/retry.
   *
   * @returns {Promise<void>} Resolve quando ambos os GETs terminarem.
   */
  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const [cats, txs] = await Promise.all([
        api.listCategories(),
        api.listTransactions(),
      ]);
      stateCache.categories = cats;
      stateCache.transactions = txs;
      stateCache.hydrated = true;
      setCategories(cats);
      setTransactions(txs);
      hydratedRef.current = true;
      setHydrated(true);
    } catch (e) {
      setError(e.message ?? "Falha ao carregar dados do servidor");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  /**
   * Cria uma nova transação no servidor e adiciona-a ao estado local.
   *
   * @param {{description: string, value: number, date: Date|string, categoryId: string}} data
   * @returns {Promise<object>} Transação criada (já com a categoria expandida).
   */
  const addTransaction = useCallback(async (data) => {
    const created = await api.createTransaction(data);
    setTransactions((prev) => {
      const next = [created, ...prev];
      stateCache.transactions = next;
      return next;
    });
    return created;
  }, []);

  const updateTransaction = useCallback(async (id, data) => {
    const updated = await api.updateTransaction(id, data);
    setTransactions((prev) => {
      const next = prev.map((t) => (t.id === id ? updated : t));
      stateCache.transactions = next;
      return next;
    });
    return updated;
  }, []);

  /**
   * Exclui uma transação no servidor e remove-a do estado local.
   *
   * @param {string} id - id (cuid) da transação.
   * @returns {Promise<void>}
   */
  const removeTransaction = useCallback(async (id) => {
    await api.deleteTransaction(id);
    setTransactions((prev) => {
      const next = prev.filter((t) => t.id !== id);
      stateCache.transactions = next;
      return next;
    });
  }, []);

  /**
   * Cria uma nova categoria no servidor e adiciona-a ao estado local.
   *
   * @param {{name: string, displayName: string, icon: string, background: string, isIncome?: boolean}} data
   * @returns {Promise<object>} Categoria criada.
   */
  const addCategory = useCallback(async (data) => {
    const created = await api.createCategory(data);
    setCategories((prev) => {
      const next = [...prev, created].sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
      );
      stateCache.categories = next;
      return next;
    });
    return created;
  }, []);

  const updateCategory = useCallback(async (id, data) => {
    const updated = await api.updateCategory(id, data);
    setCategories((prev) => {
      const next = prev
        .map((c) => (c.id === id ? updated : c))
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
      stateCache.categories = next;
      return next;
    });
    setTransactions((prev) => {
      const next = prev.map((t) =>
        t.categoryId === id ? { ...t, category: updated } : t
      );
      stateCache.transactions = next;
      return next;
    });
    return updated;
  }, []);

  /**
   * Exclui uma categoria no servidor e remove-a do estado local.
   * Categorias padrão (`isDefault`) são bloqueadas pelo back-end.
   *
   * @param {string} id - id (cuid) da categoria.
   * @returns {Promise<void>}
   */
  const removeCategory = useCallback(async (id) => {
    await api.deleteCategory(id);
    setCategories((prev) => {
      const next = prev.filter((c) => c.id !== id);
      stateCache.categories = next;
      return next;
    });
  }, []);

  return (
    <MoneyContext.Provider
      value={{
        transactions,
        categories,
        loading,
        refreshing,
        hydrated,
        error,
        refresh,
        addTransaction,
        updateTransaction,
        removeTransaction,
        addCategory,
        updateCategory,
        removeCategory,
      }}
    >
      {children}
    </MoneyContext.Provider>
  );
}
