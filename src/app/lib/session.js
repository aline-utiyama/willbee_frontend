import nextAPI from "@/services/next-api";

export async function createSession(responseData) {
  try {
    const response = await nextAPI.post("/auth/session/create", {
      ...responseData,
    });

    return response.data;
  } catch (err) {
    console.error("Error creating session:", err);
  }
}

export async function destroySession() {
  try {
    const response = await nextAPI.post("/auth/session/destroy");
    console.log("Session destroyed:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error destroying session:", err);
  }
}
