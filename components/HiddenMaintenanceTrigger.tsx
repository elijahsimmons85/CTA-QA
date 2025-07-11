import React, { useRef, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  onActivate: () => void;
};

const MAINTENANCE_PASSWORD = "AMGenter2025!"; // You can change this

export default function HiddenMaintenanceTrigger({ onActivate }: Props) {
  const [tapCount, setTapCount] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const tapTimeoutRef = useRef<number | null>(null);

  const handleTap = () => {
    setTapCount((prev) => prev + 1);

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    tapTimeoutRef.current = setTimeout(() => {
      setTapCount(0);
    }, 2000);

    if (tapCount + 1 >= 5) {
      setTapCount(0);
      setShowPasswordModal(true);
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    }
  };

  const handleSubmitPassword = () => {
    if (password === MAINTENANCE_PASSWORD) {
      setPassword("");
      setShowPasswordModal(false);
      onActivate();
    } else {
      Alert.alert("Access Denied", "Incorrect password");
      setPassword("");
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.hiddenTapZone}
        onPress={handleTap}
        activeOpacity={1}
      />
      
      {/* {tapCount > 0 && (                // Uncomment to show the tap count indicator, we dont want it for production.
        <View style={styles.tapIndicator}>
          <Text style={styles.tapIndicatorText}>{tapCount}/5</Text>
        </View>
      )} */}

      <Modal
        visible={showPasswordModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Maintenance Access</Text>
            <Text style={styles.modalSubtitle}>
              Enter the maintenance password:
            </Text>

            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Password"
              autoFocus
              onSubmitEditing={handleSubmitPassword}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setPassword("");
                  setShowPasswordModal(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitPassword}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  hiddenTapZone: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    zIndex: 999,
    backgroundColor: "transparent",
  },
  tapIndicator: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 998,
  },
  tapIndicatorText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: "80%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  passwordInput: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});