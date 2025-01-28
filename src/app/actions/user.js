import railsAPI from "@/services/rails-api";

export async function getUser() {
  try {
    const response = await railsAPI.get(`/users/settings`);
    return response.data.user;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error; // Re-throw the error for further handling
  }
}
