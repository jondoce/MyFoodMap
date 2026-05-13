import { useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@features/auth/hooks/useAuth";
import { Input } from "@shared/components/Input";
import { Button } from "@shared/components/Button";
import { ErrorMessage } from "@shared/components/ErrorMessage";
import { t } from "@shared/config/translations";

export default function RegisterScreen() {
  const { signUp, error: authError } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
  }>({});

  function validate(): boolean {
    const errors: {
      displayName?: string;
      email?: string;
      password?: string;
    } = {};
    if (!displayName.trim()) errors.displayName = t.auth.nameRequired;
    if (!email.trim()) errors.email = t.auth.emailRequired;
    if (password.length < 6)
      errors.password = t.auth.passwordMinLength;
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp(email.trim(), password, displayName.trim());
      router.replace("/(tabs)");
    } catch {
      // error is set in useAuth
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-cream-100 dark:bg-bark-900">
      <View
        className="flex-1 justify-center px-8"
        style={{ paddingTop: Platform.OS === "web" ? 0 : 60 }}
      >
        <View className="items-center mb-10 animate-fade-in">
          <View className="w-20 h-20 rounded-3xl bg-olive-600 items-center justify-center mb-5">
            <Text className="text-4xl">🌿</Text>
          </View>
          <Text className="text-3xl font-bold text-bark-900 dark:text-cream-100 font-display">
            {t.auth.registerTitle}
          </Text>
          <Text className="text-bark-400 dark:text-cream-500 mt-2 text-base text-center">
            {t.auth.registerSubtitle}
          </Text>
        </View>

        <View className="animate-slide-up-delayed">
          {authError && <ErrorMessage message={authError} />}

          <Input
            label={t.auth.name}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder={t.auth.namePlaceholder}
            error={validationErrors.displayName}
          />

          <Input
            label={t.auth.email}
            value={email}
            onChangeText={setEmail}
            placeholder={t.auth.emailPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
            error={validationErrors.email}
          />

          <Input
            label={t.auth.password}
            value={password}
            onChangeText={setPassword}
            placeholder={t.auth.passwordMin}
            secureTextEntry
            error={validationErrors.password}
          />

          <View className="mt-2">
            <Button
              title={t.auth.createAccountButton}
              onPress={handleRegister}
              loading={loading}
              variant="olive"
              size="lg"
            />
          </View>

          <Pressable className="mt-8 items-center" onPress={() => router.back()}>
            <Text className="text-bark-400 dark:text-cream-500">
              {t.auth.alreadyHaveAccount}
              <Text className="text-brand-500 font-semibold">{t.auth.signIn}</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
