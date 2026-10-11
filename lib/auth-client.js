import { createAuthClient } from "better-auth/react";

// no baseURL: it uses the current origin (works on localhost and on Vercel)
export const authClient = createAuthClient();

export const { signIn, signUp, useSession, signOut } = authClient;
