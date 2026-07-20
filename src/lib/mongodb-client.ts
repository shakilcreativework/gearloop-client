import { MongoClient, type Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;

// Cache the MongoClient on globalThis in development to survive HMR hot-reloads.
// In production a single process-lifetime client is fine.
const globalWithMongo = globalThis as typeof globalThis & {
  _betterAuthMongoClient?: MongoClient;
};

function getMongoClient(): MongoClient {
  if (process.env.NODE_ENV === "development") {
    if (!globalWithMongo._betterAuthMongoClient) {
      globalWithMongo._betterAuthMongoClient = new MongoClient(MONGODB_URI);
    }
    return globalWithMongo._betterAuthMongoClient;
  }
  return new MongoClient(MONGODB_URI);
}

/**
 * Better Auth's own MongoDB singleton.
 * This connection is independent from the Express server's marketplace DB.
 * The MongoClient constructor does NOT open a connection — it only opens
 * one on the first actual operation, so this is safe to call at import time.
 */
const client = getMongoClient();
const db: Db = client.db();

export { client as betterAuthClient, db as betterAuthDb };
