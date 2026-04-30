export const getNextMonthYear = (
  month: string,
  year: number
) => {
  const months = [
    "JAN","FEB","MAR","APR","MAY","JUN",
    "JUL","AUG","SEP","OCT","NOV","DEC"
  ];

  const index = months.indexOf(month.toUpperCase());


  if (index === -1) {
    throw new Error(`Invalid month: ${month}`);
  }

  if (index === 11) {
    return { month: "JAN", year: year + 1 };
  }

  return {
    month: months[index + 1],
    year,
  };
};