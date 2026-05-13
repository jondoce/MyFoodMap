import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@features/auth/hooks/useAuth";
import { ADMIN_EMAILS } from "@shared/config/constants";

export default function AdminScreen() {
  const { user, signOut } = useAuth();
  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch {}
  };

  if (!isAdmin) {
    return (
      <View className="flex-1 bg-cream-100 dark:bg-bark-900 items-center justify-center p-6">
        <Text className="text-bark-600 dark:text-cream-400 text-lg">
          No tienes acceso a esta sección
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-cream-100 dark:bg-bark-900 p-6">
      <Text className="text-2xl font-bold text-bark-900 dark:text-cream-100 mb-6">
        Panel de Administración
      </Text>

      <Pressable
        onPress={() => router.push("/admin/cuisines")}
        className="bg-cream-50 dark:bg-bark-800 rounded-2xl p-4 flex-row items-center mb-4"
        style={({ pressed }) => ({
          transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
        })}
      >
        <View className="w-12 h-12 rounded-xl bg-olive-100 dark:bg-olive-900/30 items-center justify-center mr-4">
          <Text className="text-2xl">🍽️</Text>
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-bark-800 dark:text-cream-100 text-lg">
            Gestionar tipos de cocina
          </Text>
          <Text className="text-sm text-bark-400 dark:text-cream-500">
            Crear, editar o eliminar tipos de cocina
          </Text>
        </View>
        <Text className="text-bark-300 dark:text-bark-500 text-2xl">›</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/admin/debug")}
        className="bg-cream-50 dark:bg-bark-800 rounded-2xl p-4 flex-row items-center mb-4"
        style={({ pressed }) => ({
          transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
        })}
      >
        <View className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 items-center justify-center mr-4">
          <Text className="text-2xl">📋</Text>
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-bark-800 dark:text-cream-100 text-lg">
            Debug Logs
          </Text>
          <Text className="text-sm text-bark-400 dark:text-cream-500">
            Ver logs de la aplicación
          </Text>
        </View>
        <Text className="text-bark-300 dark:text-bark-500 text-2xl">›</Text>
      </Pressable>

      <Pressable
        onPress={handleSignOut}
        className="bg-red-50 dark:bg-red-900/15 rounded-2xl p-4 flex-row items-center mt-auto"
        style={({ pressed }) => ({
          transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
        })}
      >
        <View className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 items-center justify-center mr-4">
          <Text className="text-2xl">🚪</Text>
        </View>
        <Text className="font-semibold text-red-600 dark:text-red-400 text-lg">
          Cerrar sesión
        </Text>
      </Pressable>
    </View>
  );
}