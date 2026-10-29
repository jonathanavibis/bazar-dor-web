import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// getAuth() runs per request: if the MongoDB client died (e.g. "Topology is
// closed" after a failed connect) it is rebuilt instead of failing forever.
export const { GET, POST } = toNextJsHandler((request) => getAuth().handler(request));
