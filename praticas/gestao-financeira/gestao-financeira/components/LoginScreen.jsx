import { useContext, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "./Button";
import { MoneyContext } from "../contexts/GlobalState";
import { colors } from "../constants/colors";
import { globalStyles } from "../styles/globalStyles";

export default function LoginScreen() {
  const { login } = useContext(MoneyContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!name.trim()) {
      Alert.alert("Informe seu nome.");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Informe sua senha.");
      return;
    }
    if (password.length < 4) {
      Alert.alert("A senha deve ter pelo menos 4 caracteres.");
      return;
    }
    login(name);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <View style={[globalStyles.card, styles.card]}>
        <View style={styles.header}>
          <Text style={styles.title}>Gestão Financeira</Text>
          <Text style={globalStyles.screenSubtitle}>
            Acesso acadêmico local para usar o app.
          </Text>
        </View>
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
        <Button onPress={handleLogin}>Entrar</Button>
        <Text style={styles.note}>
          Validação apenas local. O backend atual não usa autenticação.
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
});
