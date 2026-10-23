import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LoanSummary } from "../types";
import { CONFIG } from "../config";

interface Props {
  summary: LoanSummary | null;
}

export const SummaryCards: React.FC<Props> = ({ summary }) => {
  const totalLent = summary?.totalLent ?? 0;
  const totalRepaid = summary?.totalRepaid ?? 0;
  const overdueAmount = summary?.overdueAmount ?? 0;

  const formatCurrency = (val: number) => {
    return `${CONFIG.currency}${val.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <View style={styles.container}>
      {/* Primary Highlight Card: Total Lent */}
      <View style={[styles.card, styles.primaryCard]}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.primaryCardLabel}>TOTAL LENT</Text>
          <View style={styles.primaryBadge}>
            <Text style={styles.primaryBadgeText}>All Time</Text>
          </View>
        </View>
        <Text style={styles.primaryCardAmount}>{formatCurrency(totalLent)}</Text>
        <Text style={styles.primaryCardSubtitle}>Cumulative money lent to friends</Text>
      </View>

      {/* Two-column sub-metrics: Repaid & Overdue */}
      <View style={styles.row}>
        {/* Total Repaid Card */}
        <View style={[styles.card, styles.halfCard, styles.repaidBorder]}>
          <View style={styles.indicatorRow}>
            <View style={[styles.dot, { backgroundColor: CONFIG.theme.success }]} />
            <Text style={styles.cardLabel}>REPAID</Text>
          </View>
          <Text style={[styles.cardAmount, { color: CONFIG.theme.success }]}>
            {formatCurrency(totalRepaid)}
          </Text>
          <Text style={styles.cardSubtitle}>Settled safely</Text>
        </View>

        {/* Overdue Card */}
        <View style={[styles.card, styles.halfCard, overdueAmount > 0 ? styles.overdueBorder : null]}>
          <View style={styles.indicatorRow}>
            <View style={[styles.dot, { backgroundColor: overdueAmount > 0 ? CONFIG.theme.danger : CONFIG.theme.textLight }]} />
            <Text style={styles.cardLabel}>OVERDUE</Text>
          </View>
          <Text style={[styles.cardAmount, { color: overdueAmount > 0 ? CONFIG.theme.danger : CONFIG.theme.textNavy }]}>
            {formatCurrency(overdueAmount)}
          </Text>
          <Text style={styles.cardSubtitle}>
            {overdueAmount > 0 ? "Needs attention" : "Zero overdue"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: CONFIG.theme.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: CONFIG.theme.border,
    shadowColor: "#43281C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  primaryCard: {
    backgroundColor: CONFIG.theme.primary, // Deep rich roasted mocha brown
    borderColor: CONFIG.theme.primaryDark,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  primaryCardLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D8C7B8",
    letterSpacing: 1.2,
  },
  primaryBadge: {
    backgroundColor: "rgba(240, 228, 216, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  primaryBadgeText: {
    color: "#EFE5DC",
    fontSize: 11,
    fontWeight: "600",
  },
  primaryCardAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFDF9",
    letterSpacing: -0.5,
  },
  primaryCardSubtitle: {
    fontSize: 12,
    color: "#D8C7B8",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfCard: {
    flex: 1,
  },
  repaidBorder: {
    borderLeftWidth: 4,
    borderLeftColor: CONFIG.theme.success,
  },
  overdueBorder: {
    borderLeftWidth: 4,
    borderLeftColor: CONFIG.theme.danger,
    backgroundColor: "#FDF4F4",
  },
  indicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: CONFIG.theme.textMuted,
    letterSpacing: 0.8,
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: CONFIG.theme.textNavy,
  },
  cardSubtitle: {
    fontSize: 11,
    color: CONFIG.theme.textLight,
    marginTop: 4,
  },
});
