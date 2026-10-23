interface OtpRecord {
  code: string;
  expiresAt: number;
}

// Map phone number to OTP Record
const otpStore = new Map<string, OtpRecord>();

// OTP valid duration: 10 minutes
const OTP_EXPIRY_MS = 10 * 60 * 1000;

export const otpService = {
  generateOtp(phone: string): string {
    // Generate 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;

    otpStore.set(phone, { code, expiresAt });

    // Print prominently in server terminal
    console.log("\n=======================================================");
    console.log(`🔑 [MiniLedger OTP Notification]`);
    console.log(`📱 Phone Number : ${phone}`);
    console.log(`👉 Mock OTP     : ${code}`);
    console.log(`⏱️  Expires In   : 10 minutes`);
    console.log("=======================================================\n");

    return code;
  },

  verifyOtp(phone: string, inputCode: string): boolean {
    const record = otpStore.get(phone);
    if (!record) {
      return false;
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(phone);
      return false;
    }

    if (record.code === inputCode.trim()) {
      // Consume OTP so it cannot be reused
      otpStore.delete(phone);
      return true;
    }

    return false;
  },
};
