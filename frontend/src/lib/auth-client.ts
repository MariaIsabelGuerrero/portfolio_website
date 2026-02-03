import { createAuthClient } from "better-auth/client";
import { jwtClient } from "better-auth/client/plugins";

const authServiceUrl =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:3001"
    : process.env.AUTH_SERVICE_URL ||
      process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ||
      "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL: authServiceUrl,
  plugins: [jwtClient()],
});
