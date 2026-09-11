import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { api } from "../api/client";
import { Job, JobStatus } from "../types";
import {
  Briefcase,
  Building2,
  MapPin,
  Search,
  Plus,
  SlidersHorizontal,
} from "lucide-react-native";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Applied", value: "applied" },
  { label: "Interview", value: "interviewing" },
  { label: "Offer", value: "offer" },
  { label: "Draft", value: "draft" },
];

export default function JobsListScreen({ navigation }: any) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadJobs = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await api.getJobs({
        status: selectedFilter || undefined,
        search: searchQuery.trim() || undefined,
      });
      if (res.success) {
        setJobs(res.data);
      }
    } catch (e) {
      console.error("Failed to load jobs", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedFilter, searchQuery]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const getStatusColor = (statusValue: string) => {
    switch (statusValue?.toLowerCase()) {
      case "offer":
        return { bg: "rgba(16, 185, 129, 0.15)", text: "#10b981", border: "#059669" };
      case "interviewing":
        return { bg: "rgba(168, 85, 247, 0.15)", text: "#c084fc", border: "#9333ea" };
      case "applied":
        return { bg: "rgba(37, 99, 235, 0.15)", text: "#38bdf8", border: "#2563eb" };
      case "rejected":
        return { bg: "rgba(239, 68, 68, 0.15)", text: "#f87171", border: "#dc2626" };
      default:
        return { bg: "rgba(148, 163, 184, 0.15)", text: "#94a3b8", border: "#475569" };
    }
  };

  const renderJobCard = ({ item }: { item: Job }) => {
    const statusStyle = getStatusColor(item.Status?.value || "draft");

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("JobDetails", { jobId: item.id })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.companyBadge}>
            <Building2 color="#38bdf8" size={16} />
            <Text style={styles.companyName} numberOfLines={1}>
              {item.Company?.label || "Company"}
            </Text>
          </View>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: statusStyle.bg, borderColor: statusStyle.border },
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {item.Status?.label || "Draft"}
            </Text>
          </View>
        </View>

        <Text style={styles.jobTitle} numberOfLines={2}>
          {item.JobTitle?.label || "Job Title"}
        </Text>

        <View style={styles.cardMeta}>
          {item.Location && (
            <View style={styles.metaItem}>
              <MapPin color="#64748b" size={13} />
              <Text style={styles.metaText} numberOfLines={1}>
                {item.Location.label}
              </Text>
            </View>
          )}
          {item.workplaceType && (
            <View style={styles.workplacePill}>
              <Text style={styles.workplaceText}>{item.workplaceType}</Text>
            </View>
          )}
          {item.salaryRange && (
            <Text style={styles.salaryText}>{item.salaryRange}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search and Action Bar */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputWrapper}>
          <Search color="#64748b" size={16} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search roles, companies..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => loadJobs()}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddJob", {})}
          activeOpacity={0.8}
        >
          <Plus color="#ffffff" size={20} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterList}>
        {STATUS_FILTERS.map((f) => {
          const active = selectedFilter === f.value;
          return (
            <TouchableOpacity
              key={f.label}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setSelectedFilter(f.value)}
            >
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Jobs List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#38bdf8" size="large" />
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={renderJobCard}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadJobs(true)}
              tintColor="#38bdf8"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Briefcase color="#38bdf8" size={28} />
              </View>
              <Text style={styles.emptyTitle}>No applications yet</Text>
              <Text style={styles.emptySubtitle}>
                Track your job search opportunities and interview stages in one calm, private space.
              </Text>
              <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={() => navigation.navigate("AddJob", {})}
                activeOpacity={0.8}
              >
                <Plus color="#ffffff" size={16} />
                <Text style={styles.emptyAddButtonText}>Track First Job</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d16",
  },
  searchBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    gap: 10,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: "#1e293b",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: "#f8fafc",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#2563eb",
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  filterList: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  filterChipActive: {
    backgroundColor: "#1e293b",
    borderColor: "#38bdf8",
  },
  filterChipText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#38bdf8",
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  companyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  companyName: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "500",
  },
  statusPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  jobTitle: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#64748b",
    fontSize: 12,
  },
  workplacePill: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  workplaceText: {
    color: "#94a3b8",
    fontSize: 11,
  },
  salaryText: {
    color: "#10b981",
    fontSize: 12,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 24,
    gap: 10,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(56, 189, 248, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    color: "#f8fafc",
    fontSize: 17,
    fontWeight: "600",
  },
  emptySubtitle: {
    color: "#94a3b8",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 260,
    marginBottom: 8,
  },
  emptyAddButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginTop: 4,
  },
  emptyAddButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
});
