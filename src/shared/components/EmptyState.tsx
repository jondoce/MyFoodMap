import { View, Text, Pressable } from "react-native";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  emoji?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  emoji = "🍴",
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 bg-cream-100 dark:bg-bark-900">
      <View className="items-center animate-slide-up">
        <View className="w-24 h-24 rounded-3xl bg-cream-200 dark:bg-bark-800 items-center justify-center mb-6">
          <Text className="text-5xl">{emoji}</Text>
        </View>
        <Text className="text-2xl font-bold text-bark-800 dark:text-cream-100 mb-2 text-center font-display">
          {title}
        </Text>
        {description && (
          <Text className="text-bark-400 dark:text-cream-500 text-center mb-6 leading-6 text-base">
            {description}
          </Text>
        )}
        {actionLabel && onAction && (
          <Pressable
            onPress={onAction}
            className="bg-brand-500 px-8 py-3.5 rounded-2xl active:bg-brand-600"
            style={({ pressed }) => ({
              transform: pressed ? [{ scale: 0.96 }] : [{ scale: 1 }],
              shadowColor: "#EE7A24",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 4,
            })}
          >
            <Text className="text-white font-semibold text-base">
              {actionLabel}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
