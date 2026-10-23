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
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { CONFIG } from "../config";

export const LoginScreen: React.FC = () => {
  const { sendOtp, verifyOtp, isLoading } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [debugOtpNotice, setDebugOtpNotice] = useState<string | null>(null);

  const handleSendOtp = async () => {
    setErrorMessage("");
    setInfoMessage("");
    setDebugOtpNotice(null);

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 6) {
      setErrorMessage("Please enter a valid phone number (at least 6 digits).");
      return;
    }

    const res = await sendOtp(cleanPhone);
    if (res.success) {
      setStep("OTP");
      setInfoMessage("Verification code sent! Check your backend server console.");
      if (res.debugOtp) {
        setDebugOtpNotice(res.debugOtp);
      }
    } else {
      setErrorMessage(res.error || "Failed to send OTP. Check backend connection.");
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMessage("");
    const cleanOtp = otp.trim();

    if (!cleanOtp) {
      setErrorMessage("Please enter the 6-digit OTP code.");
      return;
    }

    const res = await verifyOtp(phone.trim(), cleanOtp);
    if (!res.success) {
      setErrorMessage(res.error || "Invalid OTP code. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand Banner */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>{CONFIG.currency}</Text>
          </View>
          <Text style={styles.brandTitle}>MiniLedger</Text>
          <Text style={styles.brandSubtitle}>
            Effortlessly track money lent to friends and stay on top of repayments
          </Text>
        </View>

        {/* Card Form */}
        <View style={styles.card}>
          <Text style={styles.formTitle}>
            {step === "PHONE" ? "Sign In with Phone" : "Enter Verification Code"}
          </Text>
          <Text style={styles.formSubtitle}>
            {step === "PHONE"
              ? "We will generate a secure OTP code for your session"
              : `Code sent to ${phone}`}
          </Text>

          {/* Feedback messages */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          {infoMessage ? (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>ℹ️ {infoMessage}</Text>
            </View>
          ) : null}

          {debugOtpNotice ? (
            <TouchableOpacity
              style={styles.debugOtpBox}
              onPress={() => setOtp(debugOtpNotice)}
            >
              <Text style={styles.debugOtpLabel}>Developer Quick-Fill:</Text>
              <Text style={styles.debugOtpValue}>Tap to use OTP: {debugOtpNotice}</Text>
            </TouchableOpacity>
          ) : null}

          {step === "PHONE" ? (
            <View>
              <Text style={styles.inputLabel}>PHONE NUMBER</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 98765 43210"
                placeholderTextColor={CONFIG.theme.textLight}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoFocus={true}
              />

              <TouchableOpacity
                style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                onPress={handleSendOtp}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Send OTP Code</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.inputLabel}>6-DIGIT OTP CODE</Text>
              <TextInput
                style={[styles.input, styles.otpInput]}
                placeholder="123456"
                placeholderTextColor={CONFIG.theme.textLight}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus={true}
              />

              <TouchableOpacity
                style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                onPress={handleVerifyOtp}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Verify & Login</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  setStep("PHONE");
                  setOtp("");
                  setErrorMessage("");
                  setDebugOtpNotice(null);
                }}
              >
                <Text style={styles.backButtonText}>← Change Phone Number</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🔒 Mock OTP authentication • Ready for Supabase PostgreSQL
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CONFIG.theme.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: CONFIG.theme.primary, // Deep Mocha Brown
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: CONFIG.theme.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  logoBadgeText: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFFDF9",
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: CONFIG.theme.textNavy,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 14,
    color: CONFIG.theme.textMuted,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 280,
    lineHeight: 20,
  },
  card: {
    backgroundColor: CONFIG.theme.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: CONFIG.theme.border,
    shadowColor: "#43281C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: CONFIG.theme.textNavy,
  },
  formSubtitle: {
    fontSize: 13,
    color: CONFIG.theme.textMuted,
    marginTop: 4,
    marginBottom: 20,
  },
  inputLabel: {
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
    marginBottom: 18,
  },
  otpInput: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 6,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: CONFIG.theme.accent, // Warm Caramel Brown
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: CONFIG.theme.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  backButton: {
    marginTop: 16,
    alignItems: "center",
  },
  backButtonText: {
    color: CONFIG.theme.accent,
    fontSize: 14,
    fontWeight: "600",
  },
  errorBox: {
    backgroundColor: CONFIG.theme.dangerBg,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 16,
  },
  errorText: {
    color: CONFIG.theme.danger,
    fontSize: 13,
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: CONFIG.theme.accentLight,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EAD9CA",
    marginBottom: 16,
  },
  infoText: {
    color: CONFIG.theme.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  debugOtpBox: {
    backgroundColor: "#F8F1EB",
    borderWidth: 1.5,
    borderColor: "#DEC4B0",
    borderStyle: "dashed",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  debugOtpLabel: {
    fontSize: 11,
    color: CONFIG.theme.accent,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  debugOtpValue: {
    fontSize: 14,
    color: CONFIG.theme.primary,
    fontWeight: "800",
    marginTop: 2,
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: CONFIG.theme.textLight,
  },
});
