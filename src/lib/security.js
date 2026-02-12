/**
 * Client-side security utilities.
 * Defence-in-depth measures; server-side RLS remains the authority.
 */

const _buckets = new Map();

export function rateLimit(key, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  let bucket = _buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    _buckets.set(key, bucket);
  }
  bucket.count += 1;
  if (bucket.count > maxAttempts) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now };
  }
  return { allowed: true, retryAfterMs: 0 };
}

export function sanitizeText(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim();
}

export function sanitizeFormData(obj) {
  const clean = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") {
      clean[k] = sanitizeText(v);
    } else if (Array.isArray(v)) {
      clean[k] = v.map((item) => (typeof item === "string" ? sanitizeText(item) : item));
    } else {
      clean[k] = v;
    }
  }
  return clean;
}

export const MAX_LENGTHS = {
  name: 100,
  email: 254,
  phone: 20,
  postcode: 12,
  address: 500,
  referralCode: 30,
  freeText: 2000,
};

export function enforceMaxLength(value, max) {
  if (typeof value !== "string") return value;
  return value.slice(0, max);
}
