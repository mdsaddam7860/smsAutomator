import asyncHandler from "../utils/asyncHandler.js";
import fetch from "node-fetch";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { hubApi } from "./hubApi.js";

// Function to send SMS
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

  console.log("SMS Response senSms fn : ", data);
  return data;
};

// Track if scheduler has been started to prevent multiple instances
let schedulerStarted = false;

// Scheduler (runs every hour, but not immediately)
async function scheduleSms(smsData) {
  // Run every hour
  setInterval(async () => {
    try {
      const result = await sendSMS(smsData);
      console.log("Scheduled SMS sent:", result);
    } catch (err) {
      console.error("Failed to send scheduled SMS:", err);
    }
  }, 60 * 60 * 1000); // 1 hour
}

// Express controller
const smsController = asyncHandler(async (req, res) => {
  const smsData = {
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    to: req.body.to || "919818010584",
    from: req.body.from || "VonageTest",
    text: req.body.text || "Hello! This SMS is sent every hour",
  };

  // Send first SMS immediately
  const data = await sendSMS(smsData);

  if (!data) {
    throw new ApiError(400, "Failed to send first SMS");
  }

  // --- STEP 2: Create HubSpot note only if SMS success
  const hubApiData = {
    token: process.env.HUBSPOT_API_KEY,
    body: `SMS Message<br>From: ${smsData.from}<br>To: ${smsData.to}`,
    timestamp: Date.now(),
    associations: [
      {
        to: { id: "150912596548" },
        types: [
          { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 },
        ],
      },
    ],
  };

  console.log("Hub API Data: ", hubApiData);

  const hubspotResponse = await hubApi(hubApiData);

  console.log("HubSpot Response: ", hubspotResponse);

  // Start scheduler only if it hasn't been started yet
  if (!schedulerStarted) {
    scheduleSms(smsData);
    schedulerStarted = true;
    console.log("Hourly SMS scheduler started");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data, hubspotResponse },
        "SMS sent + HubSpot note created + scheduler started"
      )
    );
});

export { smsController };
