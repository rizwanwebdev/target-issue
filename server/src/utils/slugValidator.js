export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function cleanSlug(slug) {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidSlug(slug) {
  return slug.length >= 3 && slug.length <= 100 && SLUG_REGEX.test(slug);
}
