import {
  Pressable,
  Text,
  ActivityIndicator,
  type PressableProps,
} from "react-native";

interface ButtonProps extends PressableProps {
  title: string;
  variant?: "primary" | "secondary" | "danger" | "olive";
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary: "bg-brand-500 active:bg-brand-600",
  secondary:
    "bg-cream-200 dark:bg-bark-800 active:bg-cream-300 dark:active:bg-bark-700",
  danger: "bg-red-500 active:bg-red-600",
  olive: "bg-olive-600 active:bg-olive-700",
};

const textVariantStyles = {
  primary: "text-white",
  secondary: "text-bark-800 dark:text-cream-100",
  danger: "text-white",
  olive: "text-white",
};

const sizeStyles = {
  sm: "px-4 py-2 rounded-xl",
  md: "px-6 py-3.5 rounded-2xl",
  lg: "px-8 py-4 rounded-2xl",
};

const textSizeStyles = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  onPress,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={`${variantStyles[variant]} ${sizeStyles[size]} items-center justify-center flex-row gap-2 ${
        disabled || loading ? "opacity-50" : ""
      }`}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => ({
        transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
        shadowColor: variant === "primary" ? "#EE7A24" : "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: variant === "primary" ? 0.2 : 0.04,
        shadowRadius: 8,
        elevation: variant === "primary" ? 4 : 2,
      })}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "secondary" ? "#573F35" : "#fff"}
          size="small"
        />
      ) : (
        <Text
          className={`${textVariantStyles[variant]} ${textSizeStyles[size]} font-semibold`}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
