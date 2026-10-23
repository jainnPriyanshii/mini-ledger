import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { CONFIG } from "../config";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { friend_name: string; amount: number; due_date: string }) => Promise<boolean>;
}

export const AddLoanModal: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
  const [friendName, setFriendName] = useState("");
  const [amount, setAmount] = useState("");

  // Default due date: 7 days from now (YYYY-MM-DD)
  const getDefaultDueDate = (daysAhead: number = 7) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split("T")[0];
  };

  const [dueDate, setDueDate] = useState(getDefaultDueDate(7));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleQuickDateSelect = (days: number) => {
    setDueDate(getDefaultDueDate(days));
  };

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!friendName.trim()) {
      setErrorMessage("Please enter a friend's name.");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage("Please enter a valid loan amount greater than zero.");
      return;
    }

    // Validate due date YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dueDate.trim()) || isNaN(new Date(dueDate).getTime())) {
      setErrorMessage("Due date must be in YYYY-MM-DD format.");
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit({
      friend_name: friendName.trim(),
      amount: numAmount,
      due_date: dueDate.trim(),
    });
    setIsSubmitting(false);

    if (success) {
      setFriendName("");
      setAmount("");
      setDueDate(getDefaultDueDate(7));
      setErrorMessage("");
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>New Loan</Text>
                <Text style={styles.modalSubtitle}>Record money lent to a friend</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Friend Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FRIEND'S NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Rahul Sharma"
                placeholderTextColor={CONFIG.theme.textLight}
                value={friendName}
                onChangeText={setFriendName}
                autoFocus={true}
              />
            </View>

            {/* Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>AMOUNT ({CONFIG.currency})</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={CONFIG.theme.textLight}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Due Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>DUE DATE (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={CONFIG.theme.textLight}
                value={dueDate}
                onChangeText={setDueDate}
              />

              {/* Quick Preset Buttons */}
              <View style={styles.quickDateRow}>
                <Text style={styles.quickDateLabel}>Quick Presets:</Text>
                <TouchableOpacity
                  style={styles.quickDatePill}
                  onPress={() => handleQuickDateSelect(7)}
                >
                  <Text style={styles.quickDateText}>+7 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDatePill}
                  onPress={() => handleQuickDateSelect(14)}
                >
                  <Text style={styles.quickDateText}>+14 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDatePill}
                  onPress={() => handleQuickDateSelect(30)}
                >
                  <Text style={styles.quickDateText}>+1 Month</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Save Loan</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(43, 23, 14, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: CONFIG.theme.textNavy,
  },
  modalSubtitle: {
    fontSize: 13,
    color: CONFIG.theme.textMuted,
    marginTop: 2,
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: CONFIG.theme.surfaceSecondary,
  },
  closeButtonText: {
    fontSize: 16,
    color: CONFIG.theme.textMuted,
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: CONFIG.theme.dangerBg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    color: CONFIG.theme.danger,
    fontSize: 13,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: CONFIG.theme.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FCFAF7",
    borderWidth: 1.5,
    borderColor: CONFIG.theme.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: CONFIG.theme.textNavy,
  },
  quickDateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
    flexWrap: "wrap",
  },
  quickDateLabel: {
    fontSize: 11,
    color: CONFIG.theme.textMuted,
    fontWeight: "600",
  },
  quickDatePill: {
    backgroundColor: CONFIG.theme.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  quickDateText: {
    color: CONFIG.theme.accent,
    fontSize: 11,
    fontWeight: "700",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: CONFIG.theme.surfaceSecondary,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: CONFIG.theme.textMuted,
  },
  submitButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: CONFIG.theme.accent, // Warm Caramel Brown
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
