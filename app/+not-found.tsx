import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

import { t } from '@shared/config/translations';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: t.notFound.title }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-xl font-bold">{t.notFound.message}</Text>

        <Link href="/" className="mt-4 py-4">
          <Text className="text-sm text-[#2e78b7]">{t.notFound.goHome}</Text>
        </Link>
      </View>
    </>
  );
}
