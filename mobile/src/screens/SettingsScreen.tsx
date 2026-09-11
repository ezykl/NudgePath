import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import {
  Server,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Smartphone,
  ExternalLink,
} from "lucide-react-native";

export default function SettingsScreen() {
  const { user, serverUrl, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Disconnect Instance",
      "Are you sure you want to disconnect this mobile device from your NudgePath server?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Account Info */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <UserIcon color="#38bdf8" size={18} />
          <Text style={styles.cardTitle}>Connected Account</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user?.name || "User"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email || "—"}</Text>
        </View>
      </View>

      {/* Server Info */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Server color="#38bdf8" size={18} />
          <Text style={styles.cardTitle}>Self-Hosted Server</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address</Text>
          <Text style={[styles.value, styles.urlText]} numberOfLines={1}>
            {serverUrl || "—"}
          </Text>
        </View>
        <View style={styles.securityPill}>
          <ShieldCheck color="#10b981" size={14} />
          <Text style={styles.securityText}>Direct connection • No middleman</Text>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Smartphone color="#38bdf8" size={18} />
          <Text style={styles.cardTitle}>NudgePath Mobile</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Version</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Architecture</Text>
          <Text style={styles.value}>BYOK / Offline SQLite First</Text>
        </View>
      </View>

      {/* Logout Action */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut color="#ef4444" size={18} />
        <Text style={styles.logoutText}>Disconnect Device</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d16",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
    paddingBottom: 10,
  },
  cardTitle: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#94a3b8",
    fontSize: 13,
  },
  value: {
    color: "#f8fafc",
    fontSize: 13,
    fontWeight: "500",
  },
  urlText: {
    color: "#38bdf8",
    fontFamily: "monospace",
    maxWidth: 200,
  },
  securityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  securityText: {
    color: "#10b981",
    fontSize: 12,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e1b2e",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    marginTop: 10,
  },
  logoutText: {
    color: "#f87171",
    fontSize: 14,
    fontWeight: "600",
  },
});
