import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "sever_admin";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8;

export function isTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return true;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string) {
  const secret = process.env.AUTH_SECRET;
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!secret || secret.length < 32 || !storedHash) return false;

  const [algorithm, saltHex, digestHex] = storedHash.split("$");
  if (
    algorithm !== "scrypt" ||
    !saltHex ||
    !digestHex ||
    !/^[a-f0-9]{32,}$/i.test(saltHex) ||
    !/^[a-f0-9]{64,}$/i.test(digestHex)
  ) {
    return false;
  }

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(digestHex, "hex");
  const actual = scryptSync(password, salt, expected.length);

  return timingSafeEqual(actual, expected);
}

export function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS;
  const payload = `${String(expiresAt)}.${randomBytes(16).toString("base64url")}`;
  const signature = createHmac("sha256", process.env.AUTH_SECRET ?? "")
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export function isAdminSessionValid(token: string | undefined) {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32 || !token) return false;

  const [expiresAt, nonce, signature, extra] = token.split(".");
  if (!expiresAt || !nonce || !signature || extra || Number(expiresAt) <= Date.now() / 1000) {
    return false;
  }

  const payload = `${expiresAt}.${nonce}`;
  const expected = createHmac("sha256", secret).update(payload).digest();
  const received = Buffer.from(signature, "base64url");

  return received.length === expected.length && timingSafeEqual(received, expected);
}
