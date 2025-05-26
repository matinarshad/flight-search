import { calculateCO2 } from "../../../utils/co2Calculator.js";

const CACHE_KEY = "allFlights";

export const allFlightResolvers = async (_, __, { sequelize, redisClient }) => {
  const cachedData = await redisClient.get(CACHE_KEY);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const Flights = sequelize.models.flights;
  const flights = await Flights.findAll();

  if (flights.length === 0) {
    throw new Error("No flights available.");
  }

  const flightsWithCO2 = flights.map((flight) => {
    const flightData = flight.get();
    flightData.co2_emission_kg = calculateCO2(flightData.distance_km);

    return flightData;
  });

  await redisClient.set(CACHE_KEY, JSON.stringify(flightsWithCO2), {
    EX: 60 * 5,
  });

  return flightsWithCO2;
};
