import { Redirect, Stack } from "expo-router";
import { useAuth } from "@features/auth/hooks/useAuth";
import { LoadingSpinner } from "@shared/components/LoadingSpinner";
import { t } from "@shared/config/translations";

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message={t.auth.checkingSession} />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
