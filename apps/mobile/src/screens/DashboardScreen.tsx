import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Loan, LoanSummary } from "../types";
import { CONFIG } from "../config";
import { SummaryCards } from "../components/SummaryCards";
import { LoanItem } from "../components/LoanItem";
import { AddLoanModal } from "../components/AddLoanModal";

export const DashboardScreen: React.FC = () => {
  const { user, logout } = useAuth();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [summary, setSummary] = useState<LoanSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [repayingId, setRepayingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchData = useCallback(async () => {
    setErrorMessage("");
    try {
      const [loansRes, summaryRes] = await Promise.all([
        api.getLoans(),
        api.getSummary(),
      ]);

      if (loansRes.success && loansRes.loans) {
        setLoans(loansRes.loans);
      } else {
        setErrorMessage(loansRes.error || "Failed to load loans.");
      }

      if (summaryRes.success && summaryRes.summary) {
        setSummary(summaryRes.summary);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Could not connect to the backend server.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const handleCreateLoan = async (data: {
    friend_name: string;
    amount: number;
    due_date: string;
  }): Promise<boolean> => {
    const res = await api.createLoan(data);
    if (res.success && res.loan) {
      fetchData();
      return true;
    } else {
      Alert.alert("Error", res.error || "Failed to add loan entry.");
      return false;
    }
  };

  const handleRepay = async (loanId: string) => {
    setRepayingId(loanId);
    try {
      const res = await api.repayLoan(loanId);
      if (res.success) {
        fetchData();
      } else {
        Alert.alert("Error", res.error || "Failed to mark loan as repaid.");
      }
    } finally {
      setRepayingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>MiniLedger</Text>
          <Text style={styles.headerSubtitle}>
            {user?.phone ? `Account: ${user.phone}` : "Dashboard"}
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={CONFIG.theme.accent} />
          <Text style={styles.loadingText}>Loading your loans...</Text>
        </View>
      ) : (
        <FlatList
          data={loans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[CONFIG.theme.accent]}
            />
          }
          ListHeaderComponent={
            <View>
              {/* Error notice if any */}
              {errorMessage ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>⚠️ {errorMessage}</Text>
                  <TouchableOpacity onPress={fetchData}>
                    <Text style={styles.retryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {/* Financial Metrics Cards */}
              <SummaryCards summary={summary} />

              {/* Section Header with Add Loan Button */}
              <View style={styles.sectionHeaderRow}>
                <View>
                  <Text style={styles.sectionTitle}>Loan Records</Text>
                  <Text style={styles.sectionSubtitle}>
                    {loans.length} {loans.length === 1 ? "entry" : "entries"} recorded
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setIsModalOpen(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addButtonText}>+ Add Loan</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <LoanItem
              loan={item}
              onRepay={handleRepay}
              isRepaying={repayingId === item.id}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Text style={styles.emptyIconText}>🤝</Text>
              </View>
              <Text style={styles.emptyTitle}>No loans recorded yet</Text>
              <Text style={styles.emptySubtitle}>
                Keep track of money you lend out by tapping the Add Loan button above.
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setIsModalOpen(true)}
              >
                <Text style={styles.emptyButtonText}>Add Your First Loan</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Add Loan Modal */}
      <AddLoanModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateLoan}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CONFIG.theme.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: CONFIG.theme.surface,
    borderBottomWidth: 1.5,
    borderBottomColor: CONFIG.theme.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: CONFIG.theme.textNavy,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: CONFIG.theme.textMuted,
    marginTop: 2,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: CONFIG.theme.surfaceSecondary,
  },
  logoutButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: CONFIG.theme.textMuted,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: CONFIG.theme.textMuted,
  },
  errorBanner: {
    backgroundColor: CONFIG.theme.dangerBg,
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorBannerText: {
    color: CONFIG.theme.danger,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  retryText: {
    color: CONFIG.theme.danger,
    fontWeight: "700",
    marginLeft: 8,
    textDecorationLine: "underline",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: CONFIG.theme.textNavy,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: CONFIG.theme.textMuted,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: CONFIG.theme.accent, // Warm Caramel Brown
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    shadowColor: CONFIG.theme.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  emptyContainer: {
    backgroundColor: CONFIG.theme.surface,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: CONFIG.theme.border,
    borderStyle: "dashed",
    padding: 32,
    alignItems: "center",
    marginTop: 16,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: CONFIG.theme.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  emptyIconText: {
    fontSize: 28,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: CONFIG.theme.textNavy,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: CONFIG.theme.textMuted,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 18,
    maxWidth: 240,
  },
  emptyButton: {
    backgroundColor: CONFIG.theme.accentLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: CONFIG.theme.accent,
    fontSize: 13,
    fontWeight: "700",
  },
});
