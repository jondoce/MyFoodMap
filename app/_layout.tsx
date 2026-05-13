import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";

import { QueryProvider } from "@shared/components/QueryProvider";
import { useColorScheme } from "@/components/useColorScheme";
import { t } from "@shared/config/translations";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

const customLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#EE7A24",
    background: "#FAF8F4",
    card: "#FDFCFA",
    text: "#1C1917",
    border: "#F5F0E8",
  },
};

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#EE7A24",
    background: "#1C1917",
    card: "#292524",
    text: "#F0ECE8",
    border: "#3D3835",
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <QueryProvider>
      <ThemeProvider
        value={colorScheme === "dark" ? customDarkTheme : customLightTheme}
      >
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor:
                colorScheme === "dark" ? "#251F1A" : "#FFFDF9",
            },
            headerTintColor:
              colorScheme === "dark" ? "#F5EDE4" : "#573F35",
            headerTitleStyle: {
              fontWeight: "700",
              fontSize: 18,
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="restaurant/create"
            options={{
              title: t.restaurants.addRestaurant,
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="restaurant/[id]"
            options={{ title: t.restaurants.restaurantDetails }}
          />
          <Stack.Screen
            name="restaurant/[id]/edit"
            options={{
              title: t.restaurants.editRestaurant,
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="admin/cuisines"
            options={{ title: t.cuisines.manageCuisineTypes }}
          />
          <Stack.Screen
            name="admin/debug"
            options={{ title: "Debug Logs" }}
          />
          <Stack.Screen
            name="profile-edit"
            options={{
              title: t.profile.editProfile,
              presentation: "modal",
            }}
          />
        </Stack>
      </ThemeProvider>
    </QueryProvider>
  );
}
