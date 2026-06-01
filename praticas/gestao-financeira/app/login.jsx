import { useContext, useMemo, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Redirect, useRouter } from "expo-router";
import Button from "../components/Button";
import { AuthContext } from "../contexts/AuthState";
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../constants/colors";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated, booting } = useContext(AuthContext);

  const [email, setEmail] = useState("aluno@exemplo.com");
  const [password, setPassword] = useState("123456");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.length > 0 && !submitting,
    [email, password, submitting]
  );

  if (!booting && isAuthenticated) return <Redirect href="/(tabs)" />;

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Informe e-mail e senha.");
      return;
    }
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      router.replace("/(tabs)");
    } catch (e) {
      Alert.alert("Acesso negado", e.message ?? "Credenciais invÃ¡lidas.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={globalStyles.screenContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>GestÃ£o Financeira</Text>
          <Text style={styles.subtitle}>Entre para continuar</Text>

          <View style={styles.form}>
            <View>
              <Text style={globalStyles.inputLabel}>E-mail</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="seu@email.com"
                style={globalStyles.input}
              />
            </View>

            <View>
              <Text style={globalStyles.inputLabel}>Senha</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="******"
                style={globalStyles.input}
              />
            </View>

            <Button onPress={handleLogin} disabled={!canSubmit}>
              {submitting ? "Entrando..." : "Entrar"}
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.primaryText,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: colors.secondaryText,
    marginBottom: 16,
  },
  form: {
    gap: 12,
  },
});

