import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import {
  useCuisines,
  useCreateCuisine,
  useUpdateCuisine,
  useDeleteCuisine,
} from "@features/cuisines/hooks/useCuisines";
import { LoadingSpinner } from "@shared/components/LoadingSpinner";
import { ErrorMessage } from "@shared/components/ErrorMessage";
import { Button } from "@shared/components/Button";
import { t } from "@shared/config/translations";
import { translateCuisine } from "@shared/config/cuisineTranslations";

const cuisineEmojis: Record<string, string> = {
  Italian: "🍝",
  Japanese: "🍣",
  Mexican: "🌮",
  Indian: "🍛",
  Chinese: "🥡",
  Thai: "🍜",
  French: "🥐",
  Spanish: "🥘",
  Korean: "🍲",
  Vietnamese: "🍲",
  Mediterranean: "🫒",
  American: "🍔",
  Brazilian: "🥩",
  Peruvian: "🐟",
  Ethiopian: "🫓",
  Turkish: "🥙",
  Lebanese: "🧆",
  Greek: "🥗",
  Caribbean: "🌴",
  Other: "🍴",
};

export default function AdminCuisinesScreen() {
  const { data: cuisines, isLoading, error } = useCuisines();
  const createMutation = useCreateCuisine();
  const updateMutation = useUpdateCuisine();
  const deleteMutation = useDeleteCuisine();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");

  function openCreate() {
    setEditingId(null);
    setName("");
    setModalVisible(true);
  }

  function openEdit(id: string, currentName: string) {
    setEditingId(id);
    setName(translateCuisine(currentName));
    setModalVisible(true);
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert(t.common.error, t.cuisines.nameRequired);
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          input: { name: name.trim() },
        });
      } else {
        await createMutation.mutateAsync({ name: name.trim() });
      }
      setModalVisible(false);
      setName("");
      setEditingId(null);
    } catch (err) {
      Alert.alert(
        t.common.error,
        err instanceof Error
          ? err.message
          : t.cuisines.failedToSave
      );
    }
  }

  function handleDelete(id: string, cuisineName: string) {
    Alert.alert(
      t.cuisines.deleteCuisineType,
      t.cuisines.deleteConfirm(cuisineName),
      [
        { text: t.common.cancel, style: "cancel" },
        {
          text: t.common.delete,
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(id);
            } catch (err) {
              Alert.alert(
                t.common.error,
                err instanceof Error
                  ? err.message
                  : t.cuisines.failedToDelete
              );
            }
          },
        },
      ]
    );
  }

  if (isLoading) {
    return <LoadingSpinner message={t.cuisines.loading} />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={
          error instanceof Error
            ? error.message
            : t.cuisines.failedToLoad
        }
      />
    );
  }

  return (
    <View className="flex-1 bg-cream-100 dark:bg-bark-900">
      <View className="px-6 py-4">
        <Button title={t.cuisines.addCuisineType} onPress={openCreate} />
      </View>

      <FlatList
        data={cuisines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const emoji = cuisineEmojis[item.name] ?? "🍴";
          const translatedName = translateCuisine(item.name);
          return (
            <View className="mx-4 mb-2 bg-cream-50 dark:bg-bark-800 rounded-2xl flex-row items-center p-4">
              <View className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 items-center justify-center mr-3">
                <Text className="text-lg">{emoji}</Text>
              </View>
              <Text className="text-base font-medium text-bark-800 dark:text-cream-100 flex-1">
                {translatedName}
              </Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => openEdit(item.id, item.name)}
                  className="w-9 h-9 rounded-xl bg-cream-200 dark:bg-bark-700 items-center justify-center"
                >
                  <Text className="text-sm">✏️</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(item.id, translateCuisine(item.name))}
                  className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/15 items-center justify-center"
                >
                  <Text className="text-sm">🗑️</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text className="text-center text-bark-400 dark:text-cream-500 py-12">
            {t.cuisines.noneFound}
          </Text>
        }
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            className="bg-cream-50 dark:bg-bark-900 rounded-t-3xl p-6"
            onTouchStart={(e: any) => e.stopPropagation()}
          >
            <Text className="text-xl font-bold text-bark-800 dark:text-cream-100 mb-5 font-display">
              {editingId
                ? t.cuisines.editCuisineType
                : t.cuisines.addCuisineType}
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t.cuisines.cuisineNamePlaceholder}
              placeholderTextColor="#9C8B7E"
              className="border-2 border-cream-200 dark:border-bark-700 rounded-2xl px-4 py-3.5 text-base text-bark-900 dark:text-cream-100 bg-cream-50 dark:bg-bark-800 mb-5"
              autoFocus
            />
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button
                  title={t.common.cancel}
                  variant="secondary"
                  onPress={() => setModalVisible(false)}
                />
              </View>
              <View className="flex-1">
                <Button
                  title={t.common.save}
                  onPress={handleSave}
                  loading={
                    createMutation.isPending ||
                    updateMutation.isPending
                  }
                />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
