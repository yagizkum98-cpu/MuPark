import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "fallback-secret-for-build";

export const MUNICIPALITY_ACCESS_COOKIE = "mupark_municipality_demo_access";

type MunicipalityAccessPayload = {
  requestId: string;
  pricingPlan: "pilot" | "operations" | "enterprise";
  scope: "municipality-demo";
};

export function signMunicipalityAccessToken(payload: Omit<MunicipalityAccessPayload, "scope">) {
  return jwt.sign(
    {
      ...payload,
      scope: "municipality-demo",
    } satisfies MunicipalityAccessPayload,
    secret,
    { expiresIn: "6h" }
  );
}

export function verifyMunicipalityAccessToken(token?: string | null) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, secret);
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      decoded.scope === "municipality-demo" &&
      typeof decoded.requestId === "string" &&
      typeof decoded.pricingPlan === "string"
    ) {
      return {
        requestId: decoded.requestId,
        pricingPlan: decoded.pricingPlan as MunicipalityAccessPayload["pricingPlan"],
      };
    }
  } catch {
    return null;
  }

  return null;
}
