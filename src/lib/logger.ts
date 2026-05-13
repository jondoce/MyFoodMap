import AsyncStorage from "@react-native-async-storage/async-storage";

const LOG_KEY = "app_logs";
const MAX_LOGS = 100;

export interface LogEntry {
  id: string;
  time: string;
  level: "info" | "error" | "network";
  msg: string;
  data?: object;
}

function fmt(): string {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
}

export const logger = {
  info: (msg: string, data?: object) => {
    if (__DEV__) console.log(`[INFO] ${msg}`, data);
    saveLog("info", msg, data);
  },
  error: (msg: string, data?: object) => {
    if (__DEV__) console.error(`[ERROR] ${msg}`, data);
    saveLog("error", msg, data);
  },
  network: (msg: string, data?: object) => {
    if (__DEV__) console.log(`[NET] ${msg}`, data);
    saveLog("network", msg, data);
  },
  get: async (): Promise<LogEntry[]> => {
    try {
      const raw = await AsyncStorage.getItem(LOG_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  },
  clear: async () => { await AsyncStorage.removeItem(LOG_KEY); },
};

async function saveLog(level: LogEntry["level"], msg: string, data?: object) {
  if (!__DEV__) return;
  try {
    const logs = (await logger.get()).slice(0, MAX_LOGS - 1);
    logs.unshift({ id: Math.random().toString(36).slice(2), time: fmt(), level, msg, data });
    await AsyncStorage.setItem(LOG_KEY, JSON.stringify(logs));
  } catch {}
}