import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is missing in .env.local");

// reuse one connection during hot reload
const g = globalThis as unknown as { _mongo?: MongoClient };
const client = g._mongo ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") g._mongo = client;

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false, // after sign-up, user goes to the login page (assignment rule)
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});