export const isValidDate = (d) => {
  return !isNaN(new Date(d).getTime());
};
