import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// AsyncStorage keys
const CONFIG_KEYS = {
  IP_ADDRESS: "museum_ip_address",
  PORT: "museum_port",
};

const DEFAULT_CONFIG = {
  ipAddress: "192.168.1.100",
  port: "8080",
};

export default function Maintenance() {
  const router = useRouter();

  const [ipAddress, setIpAddress] = useState(DEFAULT_CONFIG.ipAddress);
  const [port, setPort] = useState(DEFAULT_CONFIG.port);
  const [tempIpAddress, setTempIpAddress] = useState("");
  const [tempPort, setTempPort] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const savedIp = await AsyncStorage.getItem(CONFIG_KEYS.IP_ADDRESS);
        const savedPort = await AsyncStorage.getItem(CONFIG_KEYS.PORT);
        if (savedIp) setIpAddress(savedIp);
        if (savedPort) setPort(savedPort);
        setTempIpAddress(savedIp ?? DEFAULT_CONFIG.ipAddress);
        setTempPort(savedPort ?? DEFAULT_CONFIG.port);
      } catch (error) {
        console.error("Failed to load configuration:", error);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!tempIpAddress.trim() || !tempPort.trim()) {
      Alert.alert("Error", "Please enter both IP address and port");
      return;
    }

    const ipRegex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(tempIpAddress)) {
      Alert.alert("Error", "Please enter a valid IP address");
      return;
    }

    const portNum = parseInt(tempPort);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      Alert.alert("Error", "Please enter a valid port (1–65535)");
      return;
    }

    try {
      await AsyncStorage.setItem(CONFIG_KEYS.IP_ADDRESS, tempIpAddress);
      await AsyncStorage.setItem(CONFIG_KEYS.PORT, tempPort);
      setIpAddress(tempIpAddress);
      setPort(tempPort);
      Alert.alert("Success", "Configuration saved successfully");
      router.back();
    } catch (error) {
      console.error("Failed to save configuration:", error);
      Alert.alert("Error", "Failed to save configuration");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Maintenance Configuration</Text>
        </View>

        <View style={styles.configSection}>
          <Text style={styles.configLabel}>Current Configuration:</Text>
          <Text style={styles.currentConfig}>IP: {ipAddress}</Text>
          <Text style={styles.currentConfig}>Port: {port}</Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>IP Address:</Text>
          <TextInput
            style={styles.input}
            value={tempIpAddress}
            onChangeText={setTempIpAddress}
            placeholder="192.168.1.100"
            keyboardType="numeric"
          />
          <Text style={styles.inputLabel}>Port:</Text>
          <TextInput
            style={styles.input}
            value={tempPort}
            onChangeText={setTempPort}
            placeholder="8080"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: "100%",
    maxWidth: 500,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  configSection: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
  },
  configLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  currentConfig: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  inputSection: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  buttons: {
    flexDirection: "row",
    gap: 15,
  },
  button: {
    flex: 1,
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: "#34C759",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});