export const toSlug = (name = "") =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const findCountryBySlug = (countries, slug = "") => {
  const wanted = slug.toLowerCase();
  return (
    countries.find((c) => c.slug === wanted) ||
    countries.find((c) => c.code?.toLowerCase() === wanted) ||
    null
  );
};
