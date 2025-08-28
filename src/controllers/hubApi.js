// Function to create HubSpot Note
const hubApi = async (noteData) => {
  try {
    const response = await fetch(
      "https://api.hubapi.com/crm/v3/objects/notes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${noteData.token}`, // dynamic token
        },
        body: JSON.stringify({
          properties: {
            hs_note_body: noteData.body,
            hs_timestamp: noteData.timestamp,
          },
          associations: noteData.associations || [],
        }),
      }
    );

    if (!response.ok) {
      throw new ApiError(400, "Failed to create HubSpot Note");
    }

    const data = await response.json();
    console.log("HubSpot Response:", data);
    return data;
  } catch (error) {
    throw new ApiError("Failed to create HubSpot Note fn hubApi ", error);
  }
};

export { hubApi };
