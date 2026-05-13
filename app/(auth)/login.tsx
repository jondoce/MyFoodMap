import { useState } from "react";
import { View, Text, Pressable, Platform, KeyboardAvoidingView, ScrollView, TextInput } from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "@features/auth/hooks/useAuth";
import { Button } from "@shared/components/Button";
import { t } from "@shared/config/translations";

export default function LoginScreen() {
  const { signIn, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  function validate(): boolean {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = t.auth.emailRequired;
    if (!password) errors.password = t.auth.passwordRequired;
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleLogin() {
    if (!validate()) {
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      setLoading(false);
      await new Promise(resolve => setTimeout(resolve, 50));
      router.replace("/(tabs)");
    } catch {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#FAF8F4" }}
    >
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{ flex: 1, justifyContent: "center", paddingHorizontal: 32 }}
        >
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: "#EE7A24", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Text style={{ fontSize: 32 }}>🍽️</Text>
            </View>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#1C1917" }}>
              {t.auth.loginTitle}
            </Text>
            <Text style={{ color: "#8F7F71", marginTop: 8, fontSize: 16 }}>
              {t.auth.loginSubtitle}
            </Text>
          </View>

          <View>
            {authError && (
              <View style={{ backgroundColor: "#FEE2E2", padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <Text style={{ color: "#DC2626", textAlign: "center" }}>{authError}</Text>
              </View>
            )}

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#65584D", marginBottom: 8 }}>{t.auth.email}</Text>
              <TextInput
                style={{ borderWidth: 2, borderColor: validationErrors.email ? "#F87171" : "#E5EBE3", borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: "#FDFCFA" }}
                value={email}
                onChangeText={setEmail}
                placeholder={t.auth.emailPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {validationErrors.email && (
                <Text style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{validationErrors.email}</Text>
              )}
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#65584D", marginBottom: 8 }}>{t.auth.password}</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  style={{ borderWidth: 2, borderColor: validationErrors.password ? "#F87171" : "#E5EBE3", borderRadius: 12, padding: 14, paddingRight: 48, fontSize: 16, backgroundColor: "#FDFCFA", color: "#1C1917" }}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t.auth.passwordPlaceholder}
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  style={{ position: "absolute", right: 12, top: 0, bottom: 0, justifyContent: "center" }}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={{ fontSize: 20 }}>{showPassword ? "🙈" : "👁️"}</Text>
                </Pressable>
              </View>
              {validationErrors.password && (
                <Text style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{validationErrors.password}</Text>
              )}
            </View>

            <View style={{ marginTop: 8 }}>
              <Button
                title={t.auth.signIn}
                onPress={handleLogin}
                loading={loading}
                size="lg"
              />
            </View>

            <Link href="/(auth)/register" asChild>
              <Pressable style={{ marginTop: 32, alignItems: "center" }}>
                <Text style={{ color: "#8F7F71" }}>
                  {t.auth.newHere}
                  <Text style={{ color: "#EE7A24", fontWeight: "600" }}>
                    {t.auth.createAccount}
                  </Text>
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
