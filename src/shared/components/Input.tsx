import {
  TextInput,
  View,
  Text,
  type TextInputProps,
} from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  textColor?: string;
}

export function Input({ label, error, style, textColor, ...props }: InputProps) {
  const textStyle = textColor || "#1C1917";
  const bgStyle = textColor === "#FFFFFF" ? { backgroundColor: "#4A3F35" } : {};
  return (
    <View className="mb-5">
      <Text className="text-sm font-semibold text-bark-700 dark:text-cream-300 mb-2 tracking-wide">
        {label}
      </Text>
      <TextInput
        className={`border-2 rounded-2xl px-4 py-3.5 text-base ${
          textColor === "#FFFFFF" 
            ? "border-bark-600" 
            : "bg-cream-50 dark:bg-bark-800 border-cream-200 dark:border-bark-700"
        } ${error ? "border-red-400" : ""}`}
        placeholderTextColor="#9C8B7E"
        style={[bgStyle, { color: textStyle }, style]}
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1.5 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
}
