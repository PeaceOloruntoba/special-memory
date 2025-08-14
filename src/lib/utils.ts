// lib/utils.ts

/**
 * Converts a string to Title Case.
 * @param str The input string (e.g., "premium" to "Premium").
 * @returns The string in Title Case.
 */
export const toTitleCase = (str: string): string => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};
