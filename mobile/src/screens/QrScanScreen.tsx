import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useAuth } from "../context/AuthContext";
import { X, RefreshCw } from "lucide-react-native";

export default function QrScanScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [pairing, setPairing] = useState(false);
  const { pairWithQr } = useAuth();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned || pairing) return;
    setScanned(true);
    setPairing(true);

    try {
      await pairWithQr(data);
      // AuthProvider state change will automatically navigate to Main
    } catch (err: any) {
      Alert.alert(
        "Pairing Failed",
        err.message || "Invalid QR code. Please make sure to scan the QR in Settings > Mobile Pairing.",
        [
          {
            text: "Try Again",
            onPress: () => {
              setScanned(false);
              setPairing(false);
            },
          },
        ]
      );
    }
  };

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color="#38bdf8" size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.permissionText}>Camera permission is required to scan the pairing QR code.</Text>
        <TouchableOpacity style={styles.grantButton} onPress={requestPermission}>
          <Text style={styles.grantButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      {/* Overlay Frame */}
      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <X color="#ffffff" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Pairing Code</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.scanTarget}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
          {pairing && (
            <View style={styles.pairingIndicator}>
              <ActivityIndicator color="#38bdf8" size="large" />
              <Text style={styles.pairingText}>Connecting to NudgePath...</Text>
            </View>
          )}
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Align the QR code from NudgePath Web Settings within the frame.
          </Text>
          {scanned && !pairing && (
            <TouchableOpacity
              style={styles.rescanButton}
              onPress={() => setScanned(false)}
            >
              <RefreshCw color="#38bdf8" size={16} />
              <Text style={styles.rescanText}>Tap to Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#090d16",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  permissionText: {
    color: "#f8fafc",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  grantButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  grantButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#94a3b8",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(9, 13, 22, 0.65)",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  closeButton: {
    padding: 8,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    borderRadius: 20,
  },
  headerTitle: {
    color: "#f8fafc",
    fontSize: 17,
    fontWeight: "600",
  },
  scanTarget: {
    width: 260,
    height: 260,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  corner: {
    position: "absolute",
    width: 32,
    height: 32,
    borderColor: "#38bdf8",
  },
  tl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  tr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  br: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  pairingIndicator: {
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    gap: 10,
  },
  pairingText: {
    color: "#f8fafc",
    fontSize: 13,
    fontWeight: "500",
  },
  instructionsContainer: {
    paddingHorizontal: 32,
    alignItems: "center",
    gap: 12,
  },
  instructionsText: {
    color: "#cbd5e1",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  rescanButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1e293b",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  rescanText: {
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: "500",
  },
});
