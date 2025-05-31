// This function takes a string as input and returns the string with the first letter capitalized.
//  * @param {string} word - The string to capitalize
//  * @returns {string} - The capitalized string

export const capitalize = (word) => {
  // Handle null/undefined/empty cases
  if (!word) return "";

  // Convert to string if it's not already
  const str = typeof word === "string" ? word : String(word);

  return str.charAt(0).toUpperCase() + str.slice(1);
};
