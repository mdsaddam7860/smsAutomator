import cron from "node-cron";
import { sendSMS } from "../controllers/smsController.js"; // Adjust path as needed

const startSMSScheduler = () => {
  // Check if required environment variables are present
  if (
    !process.env.NEXMO_API_KEY ||
    !process.env.NEXMO_API_SECRET ||
    !process.env.NEXMO_PHONE_NUMBER ||
    !process.env.SMS_RECIPIENT_NUMBER
  ) {
    console.log(
      "⚠️  SMS scheduler not started - missing environment variables"
    );
    return;
  }

  // Run every hour at the beginning of the hour (e.g., 1:00, 2:00, etc.)
  cron.schedule("0 * * * *", async () => {
    try {
      console.log(
        "⏰ Running scheduled SMS task...",
        new Date().toLocaleString()
      );

      const result = await sendSMS({
        api_key: process.env.NEXMO_API_KEY,
        api_secret: process.env.NEXMO_API_SECRET,
        to: process.env.SMS_RECIPIENT_NUMBER,
        from: process.env.NEXMO_PHONE_NUMBER,
        text: `Hourly automated message - ${new Date().toLocaleString()}`,
      });

      console.log(
        "✅ Scheduled SMS sent successfully:",
        result.message_count,
        "messages"
      );
    } catch (error) {
      console.error("❌ Scheduled SMS task failed:", error.message);
    }
  });

  console.log("✅ Hourly SMS scheduler started successfully");
};

// Optional: Test function to send SMS immediately
const testSMS = async () => {
  try {
    console.log("🧪 Testing SMS immediately...");

    const result = await sendSMS({
      api_key: process.env.NEXMO_API_KEY,
      api_secret: process.env.NEXMO_API_SECRET,
      to: process.env.SMS_RECIPIENT_NUMBER,
      from: process.env.NEXMO_PHONE_NUMBER,
      text: "Test SMS - Backend is working!",
    });

    console.log("✅ Test SMS sent successfully:", result);
    return result;
  } catch (error) {
    console.error("❌ Test SMS failed:", error.message);
    throw error;
  }
};

export { startSMSScheduler, testSMS };
