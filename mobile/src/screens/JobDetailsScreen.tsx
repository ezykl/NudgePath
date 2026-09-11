import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { api } from "../api/client";
import { Job } from "../types";
import {
  Building2,
  MapPin,
  DollarSign,
  ExternalLink,
  Trash2,
  Calendar,
  CheckCircle2,
} from "lucide-react-native";

const STATUS_OPTIONS = [
  { label: "Draft", value: "draft", color: "#94a3b8" },
  { label: "Applied", value: "applied", color: "#38bdf8" },
  { label: "Interviewing", value: "interviewing", color: "#c084fc" },
  { label: "Offer", value: "offer", color: "#10b981" },
  { label: "Rejected", value: "rejected", color: "#f87171" },
];

export default function JobDetailsScreen({ navigation, route }: any) {
  const { jobId } = route.params;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchDetails = async () => {
    try {
      const data = await api.getJob(jobId);
      setJob(data);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [jobId]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!job || job.Status?.value === newStatus) return;
    setUpdating(true);
    try {
      const updated = await api.updateJob(job.id, {
        status: newStatus,
        applied: newStatus !== "draft",
      });
      setJob(updated);
    } catch (err: any) {
      Alert.alert("Update Failed", err.message || "Could not update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Job",
      "Are you sure you want to remove this job application from NudgePath?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.deleteJob(jobId);
              navigation.goBack();
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to delete job");
            }
          },
        },
      ]
    );
  };

  if (loading || !job) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color="#38bdf8" size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Info */}
      <View style={styles.headerCard}>
        <View style={styles.companyRow}>
          <Building2 color="#38bdf8" size={18} />
          <Text style={styles.companyName}>{job.Company?.label || "Company"}</Text>
        </View>

        <Text style={styles.title}>{job.JobTitle?.label}</Text>

        <View style={styles.metaRow}>
          {job.Location && (
            <View style={styles.metaItem}>
              <MapPin color="#64748b" size={14} />
              <Text style={styles.metaText}>{job.Location.label}</Text>
            </View>
          )}
          {job.workplaceType && (
            <View style={styles.pill}>
              <Text style={styles.pillText}>{job.workplaceType}</Text>
            </View>
          )}
          {job.salaryRange && (
            <View style={styles.metaItem}>
              <DollarSign color="#10b981" size={14} />
              <Text style={[styles.metaText, { color: "#10b981" }]}>{job.salaryRange}</Text>
            </View>
          )}
        </View>

        {job.jobUrl && (
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL(job.jobUrl!)}
          >
            <ExternalLink color="#38bdf8" size={14} />
            <Text style={styles.linkButtonText} numberOfLines={1}>
              Open Original Posting
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Pipeline Status Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pipeline Stage</Text>
        <View style={styles.statusGrid}>
          {STATUS_OPTIONS.map((opt) => {
            const isActive = job.Status?.value?.toLowerCase() === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.statusOption,
                  isActive && { borderColor: opt.color, backgroundColor: `${opt.color}1a` },
                ]}
                onPress={() => handleUpdateStatus(opt.value)}
                disabled={updating}
              >
                {isActive && <CheckCircle2 color={opt.color} size={14} />}
                <Text
                  style={[
                    styles.statusOptionText,
                    isActive && { color: opt.color, fontWeight: "700" },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Job Description / Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Description & Notes</Text>
        <View style={styles.descCard}>
          <Text style={styles.descText}>
            {job.description ? job.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ") : "No description provided."}
          </Text>
        </View>
      </View>

      {/* Delete Action */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Trash2 color="#ef4444" size={18} />
        <Text style={styles.deleteButtonText}>Delete Application</Text>
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
  centerContainer: {
    flex: 1,
    backgroundColor: "#090d16",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCard: {
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1e293b",
    gap: 10,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  companyName: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "500",
  },
  title: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 26,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#94a3b8",
    fontSize: 13,
  },
  pill: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillText: {
    color: "#cbd5e1",
    fontSize: 12,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
  },
  linkButtonText: {
    color: "#38bdf8",
    fontSize: 13,
    fontWeight: "500",
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  statusOptionText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "500",
  },
  descCard: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  descText: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 22,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e1b2e",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.4)",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: 8,
  },
  deleteButtonText: {
    color: "#f87171",
    fontSize: 14,
    fontWeight: "600",
  },
});
