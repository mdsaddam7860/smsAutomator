import asyncHandler from "../utils/asyncHandler.js";
import fetch from "node-fetch";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// ✅ Function to send SMS
export const sendSMS = async (smsData) => {
  const { api_key, api_secret, to, from, text } = smsData;

  const params = new URLSearchParams();
  params.append("api_key", api_key);
  params.append("api_secret", api_secret);
  params.append("to", to);
  params.append("from", from);
  params.append("text", text);

  const response = await fetch("https://rest.nexmo.com/sms/json", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!response.ok) {
    throw new ApiError(400, "Failed to send SMS");
  }

  const data = await response.json();

  if (!data) {
    throw new ApiError(400, "Failed to retrieve data from SMS API");
  }

  console.log("SMS Response:", data);
  return data;
};

// ✅ Scheduler (runs once now, then every hour)
async function scheduleSms(smsData) {
  try {
    const result = await sendSMS(smsData);
    console.log("Returned Data:", result);
  } catch (err) {
    throw new ApiError(400, "Failed to send SMS", err);
  }

  // run again after 1 hour
  setTimeout(() => scheduleSms(smsData), 60 * 60 * 1000);
}

// ✅ Express controller
const smsController = asyncHandler(async (req, res) => {
  const smsData = {
    api_key: req.body.api_key || "181303d1",
    api_secret: req.body.api_secret || "Insideatest@1",
    to: req.body.to || "919818010584",
    from: req.body.from || "VonageTest",
    text: req.body.text || "Hello! This SMS is sent every hour 🚀",
  };

  // send first SMS immediately
  const data = await sendSMS(smsData);

  // start scheduler (hourly SMS)
  scheduleSms(smsData);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "SMS sent and hourly schedule started"));
});

export { smsController };
