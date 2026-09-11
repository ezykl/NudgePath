import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { api } from "../api/client";
import { Sparkles, Link as LinkIcon, Building2, Briefcase, MapPin, DollarSign, Check } from "lucide-react-native";

export default function AddJobScreen({ navigation, route }: any) {
  const [url, setUrl] = useState(route.params?.prefilledUrl || "");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("applied");
  const [workplaceType, setWorkplaceType] = useState("Remote");

  const [parsingUrl, setParsingUrl] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleParseUrl = async () => {
    if (!url.trim()) {
      Alert.alert("Input Needed", "Please paste a job URL first.");
      return;
    }

    setParsingUrl(true);
    try {
      const res = await api.parseJobUrl(url.trim());
      if (res.success && res.data) {
        const d = res.data;
        if (d.title) setTitle(d.title);
        if (d.company) setCompany(d.company);
        if (d.location) setLocation(d.location);
        if (d.salary) setSalaryRange(d.salary);
        if (d.description) setDescription(d.description);
        if (d.workplaceType) setWorkplaceType(d.workplaceType);
        Alert.alert("Success", "Job details extracted from URL!");
      }
    } catch (err: any) {
      Alert.alert("Auto-fill notice", "Could not extract all details automatically. You can fill in the remaining fields manually.");
    } finally {
      setParsingUrl(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !company.trim()) {
      Alert.alert("Validation Error", "Please provide at least Job Title and Company.");
      return;
    }

    setSubmitting(true);
    try {
      await api.createJob({
        title: title.trim(),
        company: company.trim(),
        location: location.trim() || undefined,
        salaryRange: salaryRange.trim() || undefined,
        description: description.trim(),
        jobUrl: url.trim() || undefined,
        status,
        applied: status === "applied" || status === "interviewing" || status === "offer",
      });

      Alert.alert("Application Saved", "Job added successfully to your pipeline.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert("Error Saving Job", err.message || "Failed to create job application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Quick URL Auto-Fill Box */}
        <View style={styles.autoFillCard}>
          <View style={styles.autoFillHeader}>
            <Sparkles color="#38bdf8" size={18} />
            <Text style={styles.autoFillTitle}>Smart Link Auto-Fill</Text>
          </View>
          <Text style={styles.autoFillDesc}>
            Paste a posting link from JobStreet, Seek, Indeed, or any company site — details extract in one tap!
          </Text>
          <View style={styles.urlInputRow}>
            <View style={styles.urlInputWrapper}>
              <LinkIcon color="#64748b" size={16} />
              <TextInput
                style={styles.urlInput}
                placeholder="https://jobstreet.com/... or seek.com/..."
                placeholderTextColor="#64748b"
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity
              style={styles.extractButton}
              onPress={handleParseUrl}
              disabled={parsingUrl}
            >
              {parsingUrl ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.extractButtonText}>Extract</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Title *</Text>
            <View style={styles.inputWrapper}>
              <Briefcase color="#64748b" size={18} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Senior Frontend Engineer"
                placeholderTextColor="#64748b"
                value={title}
                onChangeText={setTitle}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company *</Text>
            <View style={styles.inputWrapper}>
              <Building2 color="#64748b" size={18} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Canva, Stripe, Globe"
                placeholderTextColor="#64748b"
                value={company}
                onChangeText={setCompany}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Location</Text>
              <View style={styles.inputWrapper}>
                <MapPin color="#64748b" size={18} />
                <TextInput
                  style={styles.input}
                  placeholder="City, Country"
                  placeholderTextColor="#64748b"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Salary</Text>
              <View style={styles.inputWrapper}>
                <DollarSign color="#64748b" size={18} />
                <TextInput
                  style={styles.input}
                  placeholder="$100k - $120k"
                  placeholderTextColor="#64748b"
                  value={salaryRange}
                  onChangeText={setSalaryRange}
                />
              </View>
            </View>
          </View>

          {/* Status Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pipeline Status</Text>
            <View style={styles.statusChips}>
              {["draft", "applied", "interviewing", "offer"].map((s) => {
                const active = status === s;
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.statusChip, active && styles.statusChipActive]}
                    onPress={() => setStatus(s)}
                  >
                    <Text style={[styles.statusChipText, active && styles.statusChipTextActive]}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Workplace Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Workplace Type</Text>
            <View style={styles.statusChips}>
              {["Remote", "Hybrid", "On-site"].map((w) => {
                const active = workplaceType === w;
                return (
                  <TouchableOpacity
                    key={w}
                    style={[styles.statusChip, active && styles.statusChipActive]}
                    onPress={() => setWorkplaceType(w)}
                  >
                    <Text style={[styles.statusChipText, active && styles.statusChipTextActive]}>
                      {w}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Notes / Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description / Notes</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Paste job requirements or your personal notes..."
              placeholderTextColor="#64748b"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Check color="#ffffff" size={20} />
                <Text style={styles.submitButtonText}>Track Job Application</Text>
              </>
            )}
          </TouchableOpacity>
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
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  autoFillCard: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
    gap: 10,
  },
  autoFillHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  autoFillTitle: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "600",
  },
  autoFillDesc: {
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 16,
  },
  urlInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  urlInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 8,
  },
  urlInput: {
    flex: 1,
    color: "#f8fafc",
    fontSize: 13,
  },
  extractButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  extractButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  formSection: {
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#1e293b",
    gap: 10,
  },
  input: {
    flex: 1,
    color: "#f8fafc",
    fontSize: 14,
  },
  textArea: {
    backgroundColor: "#0f172a",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
    color: "#f8fafc",
    fontSize: 13,
    minHeight: 100,
    textAlignVertical: "top",
  },
  statusChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusChip: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  statusChipActive: {
    backgroundColor: "#1e293b",
    borderColor: "#38bdf8",
  },
  statusChipText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "500",
  },
  statusChipTextActive: {
    color: "#38bdf8",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 10,
    marginTop: 8,
    gap: 8,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
