import { useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { logger, type LogEntry } from "@lib/logger";
import { useFocusEffect } from "expo-router";

const COLORS: Record<string, string> = { info: "text-blue-500", error: "text-red-500", network: "text-green-500" };
const ICONS: Record<string, string> = { info: "ℹ️", error: "❌", network: "🌐" };

export default function DebugScreen() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const load = useCallback(async () => setLogs(await logger.get()), []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const filtered = filter ? logs.filter(l => l.level === filter) : logs;

  return (
    <View className="flex-1 bg-cream-100 dark:bg-bark-900">
      <View className="px-4 py-3 border-b border-cream-200 dark:border-bark-800">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[{ l: null, n: "Todos" }, { l: "info", n: "ℹ️" }, { l: "error", n: "❌" }, { l: "network", n: "🌐" }].map((f) => (
            <Pressable key={f.n} onPress={() => setFilter(f.l)} className={`px-3 py-1.5 rounded-full mr-2 ${filter === f.l ? "bg-brand-500" : "bg-cream-200 dark:bg-bark-800"}`}>
              <Text className={`text-sm ${filter === f.l ? "text-white" : "text-bark-700 dark:text-cream-300"}`}>{f.n}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {filtered.length === 0 ? (
          <View className="p-8 items-center"><Text className="text-bark-400">Sin logs</Text></View>
        ) : (
          filtered.map((log) => (
            <View key={log.id} className="px-4 py-2 border-b border-cream-100 dark:border-bark-800">
              <View className="flex-row gap-2 mb-1">
                <Text className="text-xs text-bark-400">{log.time}</Text>
                <Text className={`text-xs font-bold ${COLORS[log.level]}`}>{ICONS[log.level]} {log.level.toUpperCase()}</Text>
              </View>
              <Text className="text-sm text-bark-800 dark:text-cream-100">{log.msg}</Text>
              {log.data && <Text className="text-xs text-bark-400 mt-1 font-mono">{JSON.stringify(log.data)}</Text>}
            </View>
          ))
        )}
      </ScrollView>

      <View className="p-4 border-t border-cream-200 dark:border-bark-800">
        <Pressable onPress={() => { logger.clear(); setLogs([]); }} className="bg-red-100 dark:bg-red-900/20 py-3 rounded-xl">
          <Text className="text-center text-red-600">Limpiar logs</Text>
        </Pressable>
      </View>
    </View>
  );
}