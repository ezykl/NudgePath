import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { QrCode, Server, Lock, Mail, ArrowRight } from "lucide-react-native";

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [showManual, setShowManual] = useState(false);
  const [serverUrl, setServerUrl] = useState("http://localhost:3737");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleManualLogin = async () => {
    if (!serverUrl.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Required Fields", "Please enter server URL, email, and password.");
      return;
    }

    setLoading(true);
    try {
      await login(serverUrl.trim(), email.trim(), password.trim());
    } catch (err: any) {
      Alert.alert("Login Failed", err.message || "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>NP</Text>
          </View>
          <Text style={styles.title}>NudgePath</Text>
          <Text style={styles.subtitle}>Your calm, private career companion</Text>
        </View>

        {/* Primary Action: QR Code Scan */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <Text style={styles.cardTitle}>Instant Connect</Text>
            <View style={styles.pillBadge}>
              <Text style={styles.pillText}>Zero Setup</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>
            Open NudgePath Web → Settings → Mobile Pairing, and point your camera to pair immediately.
          </Text>

          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => navigation.navigate("QrScan")}
            activeOpacity={0.8}
          >
            <QrCode color="#ffffff" size={22} style={styles.buttonIcon} />
            <Text style={styles.qrButtonText}>Scan Pairing QR Code</Text>
          </TouchableOpacity>

          <View style={styles.privacyRow}>
            <View style={styles.greenDot} />
            <Text style={styles.privacyText}>100% Self-Hosted &amp; Private to your server</Text>
          </View>
        </View>

        {/* Manual Login Toggle */}
        <View style={styles.manualContainer}>
          <TouchableOpacity
            onPress={() => setShowManual(!showManual)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleText}>
              {showManual ? "Hide Manual Connection" : "Or Connect with Server URL & Password"}
            </Text>
          </TouchableOpacity>

          {showManual && (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Server Address</Text>
                <View style={styles.inputWrapper}>
                  <Server color="#94a3b8" size={18} />
                  <TextInput
                    style={styles.input}
                    value={serverUrl}
                    onChangeText={setServerUrl}
                    placeholder="http://192.168.1.50:3737"
                    placeholderTextColor="#64748b"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Mail color="#94a3b8" size={18} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor="#64748b"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Lock color="#94a3b8" size={18} />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#64748b"
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleManualLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Connect to Instance</Text>
                    <ArrowRight color="#ffffff" size={18} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d16",
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#38bdf8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  logoText: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f8fafc",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 6,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 24,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f8fafc",
  },
  pillBadge: {
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pillText: {
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: "600",
  },
  cardDesc: {
    fontSize: 13,
    color: "#94a3b8",
    lineHeight: 19,
    marginBottom: 20,
  },
  qrButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  qrButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  privacyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
  },
  privacyText: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "500",
  },
  manualContainer: {
    marginTop: 8,
  },
  toggleButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  toggleText: {
    color: "#38bdf8",
    fontSize: 13,
    fontWeight: "500",
  },
  form: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginTop: 12,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 10,
  },
  input: {
    flex: 1,
    color: "#f8fafc",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#1e293b",
    borderColor: "#38bdf8",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 46,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
