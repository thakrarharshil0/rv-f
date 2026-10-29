/**
 * Utility to format real/current dates dynamically across Admin Panel
 */
export const getCurrentDateRange = (daysBack = 7) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - daysBack);

  const format = (date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

  return `${format(start)} - ${format(end)}`;
};

export const getTodayFormatted = () => {
  return new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};
