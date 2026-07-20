import { MongoClient, type Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

if (!MONGODB_DB_NAME) {
  throw new Error(
    "MONGODB_DB_NAME is not defined in environment variables. " +
      "Set it in your .env file (e.g. MONGODB_DB_NAME=gearloop-auth).",
  );
}

// Narrow to string after the throw above.
const uri: string = MONGODB_URI;
const dbName: string = MONGODB_DB_NAME;

// Cache the MongoClient on globalThis in development to survive HMR hot-reloads.
// In production a single process-lifetime client is fine.
const globalWithMongo = globalThis as typeof globalThis & {
  _betterAuthMongoClient?: MongoClient;
};

function getMongoClient(): MongoClient {
  if (process.env.NODE_ENV === "development") {
    if (!globalWithMongo._betterAuthMongoClient) {
      globalWithMongo._betterAuthMongoClient = new MongoClient(uri);
    }
    return globalWithMongo._betterAuthMongoClient;
  }
  return new MongoClient(uri);
}

/**
 * Better Auth's own MongoDB singleton.
 * This connection is independent from the Express server's marketplace DB.
 * The MongoClient constructor does NOT open a connection — it only opens
 * one on the first actual operation, so this is safe to call at import time.
 */
const client = getMongoClient();
const db: Db = client.db(dbName);

export { client as betterAuthClient, db as betterAuthDb };
