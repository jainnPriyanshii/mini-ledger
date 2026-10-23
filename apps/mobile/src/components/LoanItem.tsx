import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Loan } from "../types";
import { CONFIG } from "../config";

interface Props {
  loan: Loan;
  onRepay: (id: string) => Promise<void>;
  isRepaying: boolean;
}

export const LoanItem: React.FC<Props> = ({ loan, onRepay, isRepaying }) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const isOverdue = !loan.is_repaid && loan.due_date < todayStr;

  const formatDueDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (val: number) => {
    return `${CONFIG.currency}${Number(val).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <View
      style={[
        styles.card,
        loan.is_repaid
          ? styles.repaidCard
          : isOverdue
          ? styles.overdueCard
          : styles.activeCard,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.friendInfo}>
          <View
            style={[
              styles.avatar,
              isOverdue
                ? styles.avatarOverdue
                : loan.is_repaid
                ? styles.avatarRepaid
                : styles.avatarActive,
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                isOverdue
                  ? styles.avatarTextOverdue
                  : loan.is_repaid
                  ? styles.avatarTextRepaid
                  : styles.avatarTextActive,
              ]}
            >
              {loan.friend_name.trim().charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.friendName}>{loan.friend_name}</Text>
            <Text style={styles.dueDateText}>
              Due: {formatDueDate(loan.due_date)}
            </Text>
          </View>
        </View>

        <View style={styles.amountContainer}>
          <Text style={[styles.amountText, isOverdue ? styles.amountOverdue : null]}>
            {formatCurrency(loan.amount)}
          </Text>

          {/* Status Badge */}
          {loan.is_repaid ? (
            <View style={styles.badgeSuccess}>
              <Text style={styles.badgeSuccessText}>✓ Repaid</Text>
            </View>
          ) : isOverdue ? (
            <View style={styles.badgeDanger}>
              <Text style={styles.badgeDangerText}>⚠️ Overdue</Text>
            </View>
          ) : (
            <View style={styles.badgePending}>
              <Text style={styles.badgePendingText}>Pending</Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Footer for Unrepaid Loans */}
      {!loan.is_repaid && (
        <View style={styles.actionRow}>
          {isOverdue && (
            <Text style={styles.overdueNotice}>
              Payment was expected by {formatDueDate(loan.due_date)}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.repayButton, isRepaying && styles.buttonDisabled]}
            disabled={isRepaying}
            onPress={() => onRepay(loan.id)}
            activeOpacity={0.8}
          >
            {isRepaying ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.repayButtonText}>Mark as Repaid</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: CONFIG.theme.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: CONFIG.theme.border,
    shadowColor: "#43281C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  activeCard: {
    borderColor: CONFIG.theme.border,
  },
  repaidCard: {
    backgroundColor: "#FAFDFB",
    borderColor: "#D1FAE5",
    opacity: 0.9,
  },
  overdueCard: {
    backgroundColor: "#FDF4F4",
    borderColor: "#FECACA",
    borderWidth: 1.5,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarActive: {
    backgroundColor: CONFIG.theme.accentLight,
  },
  avatarRepaid: {
    backgroundColor: CONFIG.theme.successBg,
  },
  avatarOverdue: {
    backgroundColor: CONFIG.theme.dangerBg,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
  },
  avatarTextActive: {
    color: CONFIG.theme.accent,
  },
  avatarTextRepaid: {
    color: CONFIG.theme.success,
  },
  avatarTextOverdue: {
    color: CONFIG.theme.danger,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "700",
    color: CONFIG.theme.textNavy,
    marginBottom: 2,
  },
  dueDateText: {
    fontSize: 12,
    color: CONFIG.theme.textMuted,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "800",
    color: CONFIG.theme.textNavy,
    marginBottom: 6,
  },
  amountOverdue: {
    color: CONFIG.theme.danger,
  },
  badgeSuccess: {
    backgroundColor: CONFIG.theme.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeSuccessText: {
    color: CONFIG.theme.success,
    fontSize: 11,
    fontWeight: "700",
  },
  badgeDanger: {
    backgroundColor: CONFIG.theme.dangerBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeDangerText: {
    color: CONFIG.theme.danger,
    fontSize: 11,
    fontWeight: "700",
  },
  badgePending: {
    backgroundColor: CONFIG.theme.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePendingText: {
    color: CONFIG.theme.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
  actionRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: CONFIG.theme.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overdueNotice: {
    fontSize: 11,
    color: CONFIG.theme.danger,
    flex: 1,
    marginRight: 8,
  },
  repayButton: {
    backgroundColor: CONFIG.theme.accent, // Warm Caramel Brown
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: "auto",
  },
  repayButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
