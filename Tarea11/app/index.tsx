import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📸 Fotitos</Text>
      <Text style={styles.subtitle}>Sacate una foto y mirala en galería</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/camara")}>
        <Text style={styles.buttonText}>Cámara</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, Platform.OS === "web" && styles.disabledButton]}
        onPress={() => router.push("/galeria")}
        disabled={Platform.OS === "web"}
      >
        <Text style={styles.buttonText}>
          {Platform.OS === "web" ? "Galería no disponible en web" : "Ir a Galería"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#edf2f7",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e90ff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, 
    width: "80%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#a0aec0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
