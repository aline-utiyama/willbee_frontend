import railsAPI from "@/services/rails-api";
import { destroySession } from "../lib/session";
import { createSession } from "../lib/session";

export async function login(data, onSuccess, onFailure) {
  try {
    const response = await railsAPI.post("/auth/login", data);
    // set the token in a cookie, through server-side
    const sessionResponse = await createSession({ token: response.data.token });

    if (sessionResponse.success) {
      localStorage.setItem("token", response.data.token); // Store token
      onSuccess(); // Call the success callback
    }
  } catch (err) {
    console.log(err);
    onFailure(err);
  }
}

export async function logout(onSuccess) {
  const response = await destroySession();

  if (response.success) {
    localStorage.removeItem("token");
    onSuccess(); // Call the success callback
  }
}
