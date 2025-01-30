import railsAPI from "@/services/rails-api";

export async function getGoal() {
  try {
    const response = await railsAPI.get(`/goals`);
    return response.data.goals;
  } catch (error) {
    console.error("Failed to fetch goals data:", error);
    throw error; // Re-throw the error for further handling
  }
}
