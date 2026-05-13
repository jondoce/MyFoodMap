import { View, Text, Pressable } from "react-native";
import { t } from "@shared/config/translations";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 bg-cream-100 dark:bg-bark-900">
      <View className="items-center animate-slide-up">
        <View className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 items-center justify-center mb-5">
          <Text className="text-3xl">😅</Text>
        </View>
        <Text className="text-lg font-semibold text-bark-800 dark:text-cream-100 mb-2 text-center">
          {t.common.oops}
        </Text>
        <Text className="text-bark-400 dark:text-cream-500 text-center mb-6 leading-6">
          {message}
        </Text>
        {onRetry && (
          <Pressable
            onPress={onRetry}
            className="bg-brand-500 px-8 py-3.5 rounded-2xl active:bg-brand-600"
            style={({ pressed }) => ({
              transform: pressed ? [{ scale: 0.96 }] : [{ scale: 1 }],
            })}
          >
            <Text className="text-white font-semibold text-base">
              {t.common.tryAgain}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
