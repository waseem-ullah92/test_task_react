/**
 * Converts a product title into a URL/SKU-safe slug.
 * e.g. "Classic T-Shirt" → "classic-t-shirt"
 */
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generates a suggested SKU from a product title and variant options.
 * e.g. ("Classic T-Shirt", { Size: "M", Color: "Red" }) → "classic-t-shirt-m-red"
 */
export function suggestSku(title: string, options: Record<string, string>): string {
  const slug = titleToSlug(title)
  const optionPart = Object.values(options)
    .map((v) => v.toLowerCase().replace(/\s+/g, '-'))
    .join('-')
  return optionPart ? `${slug}-${optionPart}` : slug
}
