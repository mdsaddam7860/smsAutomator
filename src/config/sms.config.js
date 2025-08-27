// Add your actual credentials here directly
export const smsConfig = {
  api_key: "your_actual_nexmo_api_key", // Replace with your real API key
  api_secret: "your_actual_nexmo_api_secret", // Replace with your real API secret
  from: "your_nexmo_phone_number", // Replace with your Nexmo number (e.g., "1234567890")
  to: "recipient_phone_number", // Replace with recipient number (e.g., "+1234567890")
};

// Optional: Multiple recipients
export const recipients = [
  "recipient_number_1",
  "recipient_number_2",
  "recipient_number_3",
];
