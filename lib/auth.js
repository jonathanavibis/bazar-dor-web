
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
// Optional: which database Better Auth stores its users/sessions in.
// Without it the driver falls back to the database in the URI (or "test").
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("MONGODB_URI is missing from environment variables");
}

// The MongoDB driver *permanently* closes a MongoClient when its very first
// connection attempt fails (no internet, Atlas unreachable, wrong host, ...).
// From then on every query throws MongoTopologyClosedError ("Topology is
// closed") until the server restarts — even if the database comes back.
// So we keep the client + auth instance on globalThis (survives Next.js HMR)
// and rebuild both whenever the previous client has died.
function createAuthInstance() {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });

  const entry = {
    client,
    dead: false,
    auth: betterAuth({
      baseURL: (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/+$/, ""),
      secret: process.env.BETTER_AUTH_SECRET,

      database: mongodbAdapter(client.db(dbName), {
        client,
      }),

      emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        revokeSessionsOnPasswordReset: true,

        sendResetPassword: async ({ user, url }) => {
          console.log(`Password reset requested for ${user.email}`);
        },
      },

      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },

        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      },
    }),
  };

  // Warm up the connection; if it fails, the next request builds a fresh client.
  client.connect().catch((err) => {
    entry.dead = true;
    console.error(
      `[MongoDB] connection failed: ${err.name} - ${err.message.split("\n")[0]}`
    );
  });

  return entry;
}

function getEntry() {
  const current = globalThis._bazardorAuthEntry;
  if (current && !current.dead) return current;
  const fresh = createAuthInstance();
  globalThis._bazardorAuthEntry = fresh;
  return fresh;
}

// Read on every request (see app/api/auth/[...all]/route.js) so a client that
// died is replaced instead of failing forever.
export function getAuth() {
  return getEntry().auth;
}
