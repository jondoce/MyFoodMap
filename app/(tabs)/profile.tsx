import { View, Text, Pressable, Image } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@features/auth/hooks/useAuth";
import { Button } from "@shared/components/Button";
import { LoadingSpinner } from "@shared/components/LoadingSpinner";
import { ADMIN_EMAILS } from "@shared/config/constants";
import { t } from "@shared/config/translations";

export default function ProfileScreen() {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  const isAdmin = user?.email
    ? ADMIN_EMAILS.includes(user.email.toLowerCase())
    : false;

  async function handleSignOut() {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch {
      // error handled in useAuth
    }
  }

  const initials = (
    user?.user_metadata?.display_name?.charAt(0) ??
    user?.email?.charAt(0) ??
    "?"
  ).toUpperCase();

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <View className="flex-1 bg-cream-100 dark:bg-bark-900">
      <View className="items-center pt-12 pb-8 animate-fade-in">
        <Pressable onPress={() => router.push("/profile-edit")}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="w-24 h-24 rounded-3xl mb-4 shadow-warm"
            />
          ) : (
            <View className="w-24 h-24 rounded-3xl bg-brand-500 items-center justify-center mb-4 shadow-warm">
              <Text className="text-white text-3xl font-bold font-display">
                {initials}
              </Text>
            </View>
          )}
        </Pressable>
        <Text className="text-2xl font-bold text-bark-900 dark:text-cream-100 font-display">
          {user?.user_metadata?.display_name ?? t.profile.foodie}
        </Text>
        <Text className="text-bark-400 dark:text-cream-500 mt-1">
          {user?.email}
        </Text>
      </View>

      <View className="px-6 gap-3 animate-slide-up">
        <Pressable
          onPress={() => router.push("/profile-edit")}
          className="bg-cream-50 dark:bg-bark-800 rounded-2xl p-4 flex-row items-center shadow-soft"
          style={({ pressed }) => ({
            transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
          })}
        >
          <View className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 items-center justify-center mr-3">
            <Text className="text-lg">✏️</Text>
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-bark-800 dark:text-cream-100">
              {t.profile.editProfile}
            </Text>
            <Text className="text-sm text-bark-400 dark:text-cream-500">
              {t.profile.editDescription}
            </Text>
          </View>
          <Text className="text-bark-300 dark:text-bark-500 text-lg">
            ›
          </Text>
        </Pressable>

        {isAdmin && (
          <>
            <Pressable
              onPress={() => router.push("/admin/cuisines")}
              className="bg-cream-50 dark:bg-bark-800 rounded-2xl p-4 flex-row items-center shadow-soft"
              style={({ pressed }) => ({
                transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
              })}
            >
              <View className="w-10 h-10 rounded-xl bg-olive-100 dark:bg-olive-900/30 items-center justify-center mr-3">
                <Text className="text-lg">⚙️</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-bark-800 dark:text-cream-100">
                  {t.cuisines.manageCuisineTypes}
                </Text>
                <Text className="text-sm text-bark-400 dark:text-cream-500">
                  {t.cuisines.manageDescription}
                </Text>
              </View>
              <Text className="text-bark-300 dark:text-bark-500 text-lg">
                ›
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/admin/debug")}
              className="bg-cream-50 dark:bg-bark-800 rounded-2xl p-4 flex-row items-center shadow-soft"
              style={({ pressed }) => ({
                transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
              })}
            >
              <View className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 items-center justify-center mr-3">
                <Text className="text-lg">📋</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-bark-800 dark:text-cream-100">
                  Debug Logs
                </Text>
                <Text className="text-sm text-bark-400 dark:text-cream-500">
                  Ver logs de Supabase y errores
                </Text>
              </View>
              <Text className="text-bark-300 dark:text-bark-500 text-lg">
                ›
              </Text>
            </Pressable>
          </>
        )}

        <Pressable
          onPress={handleSignOut}
          className="bg-red-50 dark:bg-red-900/15 rounded-2xl p-4 flex-row items-center"
          style={({ pressed }) => ({
            transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
          })}
        >
          <View className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 items-center justify-center mr-3">
            <Text className="text-lg">🚪</Text>
          </View>
          <Text className="font-semibold text-red-600 dark:text-red-400">
            {t.auth.signOut}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
