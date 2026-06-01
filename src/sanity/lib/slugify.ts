/**
 * Generates a clean, Turkish-friendly slug from a given string.
 * Prevents default Sanity transliteration issues (like "ö" -> "oe", "ü" -> "ue").
 */
export function turkishSlugify(input: string): string {
  if (!input) return "";

  // Convert to lowercase, handling Turkish-specific uppercase characters manually first to ensure correctness
  let str = input
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLocaleLowerCase("tr-TR");

  // Turkish character mapping table
  const turkishChars: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
  };

  str = str.replace(/[çğıöşü]/g, (char) => turkishChars[char] || char);

  // Clean string and format as slug
  return str
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except space and hyphen
    .trim()
    .replace(/\s+/g, "-")        // Replace multiple spaces with a single hyphen
    .replace(/-+/g, "-");        // Replace multiple hyphens with a single hyphen
}
