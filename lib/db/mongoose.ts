import mongoose from "mongoose";
import { existsSync, readFileSync } from "fs";
import path from "path";

function getEnvFromDotEnv(key: string) {
  const envPath = path.join(process.cwd(), ".env");
  if (!existsSync(envPath)) return undefined;

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const envKey = trimmed.slice(0, separatorIndex).trim();
    if (envKey !== key) continue;

    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    return rawValue.replace(/^['"]|['"]$/g, "");
  }

  return undefined;
}

const uri = process.env.MONGODB_URI || getEnvFromDotEnv("MONGODB_URI");

if (!uri) {
  console.warn("Missing MONGODB_URI environment variable, using fallback for build");
}
const effectiveUri = uri || "mongodb://fallback-for-build";

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: Cached | undefined;
}

const cached = globalThis.mongooseCache || { conn: null, promise: null };

export async function connectDb(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(effectiveUri)
      .then((mongooseInstance) => {
        cached.conn = mongooseInstance;
        return mongooseInstance;
      });
  }

  const conn = await cached.promise;
  globalThis.mongooseCache = cached;
  return conn;
}

export default mongoose;
