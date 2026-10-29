import { createAuthClient } from "better-auth/react";

// Same origin in the browser (works on localhost:3000 *and* on the deployed
// domain) — only the server-side render falls back to the dev URL, where the
// client never actually fetches.
const baseURL =
  typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

export const authClient = createAuthClient({ baseURL });

export const { signIn, signUp, useSession, signOut } = authClient;
