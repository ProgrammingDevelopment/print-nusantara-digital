export const PRODUCT_CATEGORIES = [
  { value: "all", labelKey: "products.all" },
  { value: "softBox", labelKey: "products.softBox" },
  { value: "foodBox", labelKey: "products.foodBox" },
  { value: "printing", labelKey: "products.printing" },
  { value: "services", labelKey: "products.services" },
] as const;

export const isHttpImageUrl = (value: string | null) =>
  Boolean(value && /^https?:\/\//i.test(value));
