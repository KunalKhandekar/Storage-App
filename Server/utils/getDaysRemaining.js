export const getDayRemaining = (futureDate) => {
  const fDate = new Date(futureDate);
  const today = new Date();
  // Difference in milliseconds
  const diffMs = fDate - today;
  // Convert ms → days
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};