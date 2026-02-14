import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;

if (!secret) {
  console.warn("Missing JWT_SECRET/NEXTAUTH_SECRET environment variable, using fallback for build");
}
const effectiveSecret = secret || "fallback-secret-for-build";

export type AuthRole = "admin" | "driver";

export interface AuthUser {
  email: string;
  role: AuthRole;
}

const defaultUsers: AuthUser[] = [
  {
    email: process.env.MUPARK_ADMIN_EMAIL ?? "admin@mupark.local",
    role: "admin",
  },
  {
    email: process.env.MUPARK_DRIVER_EMAIL ?? "driver@mupark.local",
    role: "driver",
  },
];

const passwordOverrides: Record<AuthRole, string> = {
  admin: process.env.MUPARK_ADMIN_PASSWORD ?? "AdminPass123!",
  driver: process.env.MUPARK_DRIVER_PASSWORD ?? "DriverPass123!",
};

export function findUser(email: string) {
  return defaultUsers.find((user) => user.email === email);
}

export function validateCredentials(email: string, password: string) {
  const user = findUser(email);
  if (!user) return null;

  if (passwordOverrides[user.role] !== password) {
    return null;
  }

  return user;
}

export function signToken(payload: AuthUser) {
  return jwt.sign(payload, effectiveSecret, { expiresIn: "8h" });
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, effectiveSecret);
    if (typeof decoded === "object" && decoded !== null && "role" in decoded && "email" in decoded) {
      return { email: decoded.email as string, role: decoded.role as AuthRole };
    }
  } catch (error) {
    return null;
  }

  return null;
}
