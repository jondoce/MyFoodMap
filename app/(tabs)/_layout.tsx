import { Redirect, Tabs, Stack } from "expo-router";
import { Image, Platform, View, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "@features/auth/hooks/useAuth";
import { LoadingSpinner } from "@shared/components/LoadingSpinner";
import { ADMIN_EMAILS } from "@shared/config/constants";
import { t } from "@shared/config/translations";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  focused: boolean;
}) {
  return (
    <View
      className="items-center justify-center"
      style={{
        width: 48,
        height: 32,
        borderRadius: 16,
        backgroundColor: props.focused ? "#FEF7EE" : "transparent",
      }}
    >
      <FontAwesome
        size={20}
        style={{ marginBottom: -1 }}
        {...props}
        color={props.focused ? "#EE7A24" : props.color}
      />
    </View>
  );
}

function UserBadge() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.display_name as string | null;
  const avatarUrl = user?.user_metadata?.avatar_url as string | null;

  if (!displayName && !avatarUrl) return null;

  return (
    <View className="flex-row items-center mr-3">
      {displayName && (
        <Text className="text-sm font-semibold text-bark-600 mr-2" numberOfLines={1}>
          {displayName}
        </Text>
      )}
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <View className="w-8 h-8 rounded-full bg-brand-500 items-center justify-center">
          <Text className="text-white text-sm font-bold">
            {displayName?.charAt(0).toUpperCase() ?? "?"}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message={t.common.loading} />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;
  const isWeb = Platform.OS === "web";

  if (isAdmin) {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#EE7A24",
          tabBarInactiveTintColor: "#9C8B7E",
          tabBarStyle: {
            backgroundColor: isWeb ? "#FDFCFA" : undefined,
            borderTopWidth: 0,
            elevation: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.04,
            shadowRadius: 12,
            height: Platform.OS === "ios" ? 88 : 80,
            paddingTop: 8,
            paddingBottom: Platform.OS === "android" ? 20 : 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            letterSpacing: 0.3,
          },
          headerStyle: {
            backgroundColor: "#FDFCFA",
            shadowColor: "transparent",
            elevation: 0,
          },
          headerTintColor: "#1C1917",
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 18,
            letterSpacing: 0.3,
          },
        }}
      >
      <Tabs.Screen
        name="admin"
        options={{
          title: "Gestión",
          headerRight: () => <UserBadge />,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="cogs" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="map" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#EE7A24",
        tabBarInactiveTintColor: "#9C8B7E",
        tabBarStyle: {
          backgroundColor: isWeb ? "#FDFCFA" : undefined,
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
          height: Platform.OS === "ios" ? 88 : 80,
          paddingTop: 8,
          paddingBottom: Platform.OS === "android" ? 20 : 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.3,
        },
        headerStyle: {
          backgroundColor: "#FDFCFA",
          shadowColor: "transparent",
          elevation: 0,
        },
        headerTintColor: "#1C1917",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.myRestaurantes,
          headerRight: () => <UserBadge />,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="cutlery" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: t.tabs.map,
          headerRight: () => <UserBadge />,
          href: isWeb ? null : "/(tabs)/map",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="map-marker" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.tabs.profile,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="user" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen name="admin" options={{ href: null }} />
    </Tabs>
  );
}