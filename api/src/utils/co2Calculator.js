const CO2_EMISSION_FACTOR = 0.00025;

export const calculateCO2 = (distance) => {
  return parseFloat((distance * CO2_EMISSION_FACTOR).toFixed(2));
};
