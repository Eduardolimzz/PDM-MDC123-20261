import { useContext, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "./Button";
import { MoneyContext } from "../contexts/GlobalState";
import { colors } from "../constants/colors";
import { globalStyles } from "../styles/globalStyles";

export default function LoginScreen() {
  const { login, register } = useContext(MoneyContext);
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Informe seu email.");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Informe sua senha.");
      return;
    }
    setSubmitting(true);
    try {
      await login({
        email: email.trim().toLowerCase(),
        password,
      });
    } catch {
      Alert.alert("Erro ao entrar", "Credenciais inválidas");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert("Informe seu nome.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Informe seu email.");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Informe sua senha.");
      return;
    }
    setSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      Alert.alert("Cadastro criado", "Agora entre com seu email e senha.");
      resetForm();
      setMode("login");
    } catch (e) {
      Alert.alert("Erro ao cadastrar", e.message ?? "Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const isRegister = mode === "register";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <View style={[globalStyles.card, styles.card]}>
        <View style={styles.header}>
          <Text style={styles.title}>Gestão Financeira</Text>
          <Text style={globalStyles.screenSubtitle}>
            {isRegister ? "Crie um acesso simples." : "Entre para acessar o app."}
          </Text>
        </View>
        {isRegister && (
          <View>
            <Text style={globalStyles.inputLabel}>Nome</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Digite seu nome"
              autoCapitalize="words"
              style={globalStyles.input}
            />
          </View>
        )}
        <View>
          <Text style={globalStyles.inputLabel}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="admin@admin.com"
            autoCapitalize="none"
            keyboardType="email-address"
            style={globalStyles.input}
          />
        </View>
        <View>
          <Text style={globalStyles.inputLabel}>Senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 4 caracteres"
            secureTextEntry
            style={globalStyles.input}
          />
        </View>
        <Button
          onPress={isRegister ? handleRegister : handleLogin}
          disabled={submitting}
        >
          {submitting ? "Aguarde..." : isRegister ? "Cadastrar" : "Entrar"}
        </Button>
        <TouchableOpacity
          onPress={() => {
            resetForm();
            setMode(isRegister ? "login" : "register");
          }}
        >
          <Text style={styles.link}>
            {isRegister ? "Já tenho cadastro" : "Criar cadastro"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.note}>
          Login acadêmico simples. Não usa token nem rotas protegidas.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  card: {
    gap: 14,
    padding: 20,
  },
  header: {
    gap: 6,
    marginBottom: 4,
  },
  title: {
    color: colors.primaryText,
    fontSize: 28,
    fontWeight: "900",
  },
  note: {
    color: colors.secondaryText,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  link: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
});
