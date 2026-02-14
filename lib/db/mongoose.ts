import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

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
