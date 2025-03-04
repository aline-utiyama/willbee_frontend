import axios from "axios";
import railsAPI from "@/services/rails-api";

describe("railsAPI", () => {
  beforeEach(() => {
    localStorage.setItem("token", "test-token");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should include the authorization token in requests", async () => {
    const requestInterceptor =
      railsAPI.interceptors.request.handlers[0].fulfilled;

    const mockConfig = { headers: {} };
    const updatedConfig = requestInterceptor(mockConfig);

    expect(updatedConfig.headers.Authorization).toBe("Bearer test-token");
  });
});
