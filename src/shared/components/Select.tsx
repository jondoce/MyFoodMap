import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { t } from "@shared/config/translations";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  textColor?: string;
}

function WebSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  textColor,
}: SelectProps) {
  const textStyle = textColor === "#FFFFFF" ? "text-white" : "text-bark-900 dark:text-cream-100";
  const bgStyle = textColor === "#FFFFFF" ? "bg-bark-700" : "bg-cream-50 dark:bg-bark-800";
  return (
    <View className="mb-5">
      <Text className="text-sm font-semibold text-bark-700 dark:text-cream-300 mb-2 tracking-wide">
        {label}
      </Text>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={`border-2 rounded-2xl px-4 py-3.5 text-base w-full ${textStyle} ${bgStyle} ${
          error
            ? "border-red-400"
            : "border-cream-200 dark:border-bark-700"
        }`}
      >
        <option value="" disabled>
          {placeholder ?? t.common.selectOption}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <Text className="text-red-500 text-sm mt-1.5 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
}

function NativeSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  textColor,
}: SelectProps) {
  const [visible, setVisible] = useState(false);
  const selected = options.find((o) => o.value === value);
  const textStyle = textColor === "#FFFFFF" ? "text-white" : "text-bark-900 dark:text-cream-100";
  const bgStyle = textColor === "#FFFFFF" ? "bg-bark-700 border-bark-600" : "bg-cream-50 dark:bg-bark-800 border-cream-200 dark:border-bark-700";
  const placeholderStyle = textColor === "#FFFFFF" ? "text-cream-300" : "text-bark-400 dark:text-bark-500";

  return (
    <View className="mb-5">
      <Text className="text-sm font-semibold text-bark-700 dark:text-cream-300 mb-2 tracking-wide">
        {label}
      </Text>
      <Pressable
        onPress={() => setVisible(true)}
        className={`border-2 rounded-2xl px-4 py-3.5 ${error ? "border-red-400" : bgStyle}`}
      >
        <Text
          className={`text-base ${selected ? textStyle : placeholderStyle}`}
        >
          {selected?.label ?? placeholder ?? t.common.selectOption}
        </Text>
      </Pressable>
      {error && (
        <Text className="text-red-500 text-sm mt-1.5 font-medium">
          {error}
        </Text>
      )}

      <Modal visible={visible} transparent animationType="slide">
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setVisible(false)}
        >
          <Pressable
            className="bg-cream-50 dark:bg-bark-900 rounded-t-3xl max-h-[60%]"
            onPress={(e: any) => e.stopPropagation()}
          >
            <View className="p-5 border-b border-cream-200 dark:border-bark-700 flex-row justify-between items-center">
              <Text className="text-lg font-bold text-bark-800 dark:text-cream-100 font-display">
                {label}
              </Text>
              <Pressable
                onPress={() => setVisible(false)}
                className="w-8 h-8 rounded-full bg-cream-200 dark:bg-bark-700 items-center justify-center"
              >
                <Text className="text-bark-500 dark:text-cream-400 text-sm font-bold">
                  ✕
                </Text>
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(item.value);
                    setVisible(false);
                  }}
                  className={`px-5 py-4 border-b border-cream-100 dark:border-bark-800 ${
                    item.value === value
                      ? "bg-brand-50 dark:bg-brand-900/15"
                      : ""
                  }`}
                >
                  <Text
                    className={`text-base ${
                      item.value === value
                        ? "text-brand-600 dark:text-brand-400 font-semibold"
                        : "text-bark-800 dark:text-cream-200"
                    }`}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export function Select(props: SelectProps) {
  if (Platform.OS === "web") {
    return <WebSelect {...props} />;
  }
  return <NativeSelect {...props} />;
}
