import { ActivityIndicator, View, Text } from "react-native";
import { t } from "@shared/config/translations";

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({
  message = t.common.loading,
}: LoadingSpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center bg-cream-100 dark:bg-bark-900">
      <View className="items-center animate-fade-in">
        <View className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/30 items-center justify-center mb-5 animate-pulse-warm">
          <Text className="text-3xl">🍽️</Text>
        </View>
        <ActivityIndicator size="small" className="text-brand-500 mb-3" />
        <Text className="text-bark-500 dark:text-cream-400 font-medium">
          {message}
        </Text>
      </View>
    </View>
  );
}
