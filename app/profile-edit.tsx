import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Image, Platform } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@features/auth/hooks/useAuth";
import { Button } from "@shared/components/Button";
import { t } from "@shared/config/translations";

const PRESET_AVATARS = [
  "https://api.dicebear.com/9.x/lorelei/png?seed=Man1&backgroundColor=transparent&skinColor=e8c99b&hairColor=2c1b0f&beardProbability=0",
  "https://api.dicebear.com/9.x/lorelei/png?seed=Man2&backgroundColor=transparent&skinColor=d4a574&hairColor=e6c45c&beardProbability=0",
  "https://api.dicebear.com/9.x/lorelei/png?seed=Man3&backgroundColor=transparent&skinColor=cfa668&hairColor=2c1b0f&beardProbability=0",
  "https://api.dicebear.com/9.x/lorelei/png?seed=Man4&backgroundColor=transparent&skinColor=e0b98c&hairColor=8b0000&beardProbability=0",
  "https://api.dicebear.com/9.x/lorelei/png?seed=Man5&backgroundColor=transparent&skinColor=cf9e6d&hairColor=e6c45c&beardProbability=0",
  "https://api.dicebear.com/9.x/lorelei/png?seed=Woman1&backgroundColor=transparent&skinColor=e8c99b&hairColor=2c1b0f",
  "https://api.dicebear.com/9.x/lorelei/png?seed=Woman2&backgroundColor=transparent&skinColor=d4a574&hairColor=e6c45c",
  "https://api.dicebear.com/9.x/lorelei/png?seed=Woman3&backgroundColor=transparent&skinColor=cfa668&hairColor=8b0000",
  "https://api.dicebear.com/9.x/lorelei/png?seed=Woman4&backgroundColor=transparent&skinColor=e0b98c&hairColor=2c1b0f",
  "https://api.dicebear.com/9.x/lorelei/png?seed=Woman5&backgroundColor=transparent&skinColor=cf9e6d&hairColor=8b0000",
];

export default function ProfileEditScreen() {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.user_metadata?.display_name) {
      setDisplayName(user.user_metadata.display_name);
    }
    if (user?.user_metadata?.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url);
    }
  }, [user]);

  const usePreset = PRESET_AVATARS.includes(avatarUrl);

  async function handleSave() {
    if (!displayName.trim()) {
      setError(t.auth.nameRequired);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateProfile({
        displayName: displayName.trim(),
        avatarUrl: avatarUrl || "",
      });
      router.back();
    } catch (err) {
      setError(t.common.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FAF8F4", paddingTop: Platform.OS === "web" ? 40 : 60 }}>
      <View style={{ paddingHorizontal: 24 }}>
        {error && (
          <View style={{ backgroundColor: "#FEE2E2", padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ color: "#DC2626", textAlign: "center" }}>{error}</Text>
          </View>
        )}

        <View style={{ alignItems: "center", marginBottom: 24 }}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: "#EE7A24", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "white", fontSize: 36, fontWeight: "bold" }}>
                {(displayName || user?.email || "?").charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#65584D", marginBottom: 8 }}>
            {t.auth.name}
          </Text>
          <TextInput
            style={{ borderWidth: 2, borderColor: "#E5EBE3", borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: "#FDFCFA" }}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder={t.auth.namePlaceholder}
          />
        </View>

        <Text style={{ fontSize: 16, fontWeight: "600", color: "#1C1917", marginBottom: 12 }}>
          {t.profile.chooseAvatar}
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          {PRESET_AVATARS.map((url) => (
            <Pressable
              key={url}
              onPress={() => setAvatarUrl(url)}
              style={{ width: 60, height: 60, borderRadius: 30, borderWidth: avatarUrl === url ? 3 : 0, borderColor: "#EE7A24", overflow: "hidden" }}
            >
              <Image source={{ uri: url }} style={{ width: 60, height: 60 }} />
            </Pressable>
          ))}
        </View>

        <Button
          title={t.common.save}
          onPress={handleSave}
          loading={loading}
          size="lg"
        />
      </View>
    </View>
  );
}