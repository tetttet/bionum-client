// AsyncStorageViewer.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { fs } from "@/constants/typography";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface StorageItem {
  key: string;
  value: string | null;
}

const AsyncStorageViewer: React.FC = () => {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Загружаем все ключи и значения
  const loadStorage = async () => {
    try {
      setLoading(true);
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);
      const formatted = stores.map(([key, value]) => ({
        key,
        value,
      }));
      setItems(formatted);
    } catch (error) {
      console.error("Ошибка при чтении AsyncStorage:", error);
    } finally {
      setLoading(false);
    }
  };

  // Очистка конкретного ключа
  const clearItem = async (key: string) => {
    Alert.alert("Подтверждение", `Удалить "${key}"?`, [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem(key);
          loadStorage();
        },
      },
    ]);
  };

  // Очистить всё
  const clearAll = async () => {
    Alert.alert("Подтверждение", "Удалить все данные AsyncStorage?", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить всё",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          loadStorage();
        },
      },
    ]);
  };

  useEffect(() => {
    loadStorage();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 AsyncStorage Viewer</Text>

      <TouchableOpacity style={styles.refreshButton} onPress={loadStorage}>
        <Text style={styles.refreshText}>
          {loading ? "Загрузка..." : "🔄 Обновить"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearAllButton} onPress={clearAll}>
        <Text style={styles.clearAllText}>🧹 Очистить всё</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scroll}>
        {items.length === 0 ? (
          <Text style={styles.emptyText}>Нет данных в AsyncStorage</Text>
        ) : (
          items.map(({ key, value }) => (
            <View key={key} style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.key}>{key}</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
              <TouchableOpacity onPress={() => clearItem(key)}>
                <Text style={styles.delete}>🗑</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: fs(20),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  refreshButton: {
    backgroundColor: "#1E88E5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  refreshText: { color: "#fff", fontWeight: "600" },
  clearAllButton: {
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  clearAllText: { color: "#fff", fontWeight: "600" },
  scroll: { flex: 1 },
  item: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  key: { color: "#81D4FA", fontWeight: "bold" },
  value: { color: "#ccc", marginTop: 4 },
  delete: { color: "#E57373", fontSize: fs(20), paddingLeft: 10 },
  emptyText: { color: "#777", textAlign: "center", marginTop: 50 },
});

export default AsyncStorageViewer;
