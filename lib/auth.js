import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/bazardor";

// reuse one Mongo connection during hot reload in development
const g = globalThis;
const client = g._mongoClient ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") g._mongoClient = client;

// A social provider is switched on only when BOTH its id and secret exist.
const socialProviders = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_APP_URL].filter(Boolean),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: false, // after sign-up the user goes to the login page
  },

  socialProviders,

  // same email through Google and GitHub = one account
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
});
