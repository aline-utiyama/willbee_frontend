import railsAPI from "@/services/rails-api";

export async function getUser() {
  try {
    const response = await railsAPI.get(`/users/settings`);
    return response.data.user;
  } catch (error) {
    console.warn("User not authenticated or failed to fetch user data.");
    return null;
  }
}
