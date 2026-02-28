export const numberToPercentage = (number: number) => {
  const percentage = (number * 100).toFixed(2);
  return `${percentage}%`;
};
