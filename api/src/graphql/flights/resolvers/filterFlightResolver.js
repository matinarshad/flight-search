import { Op } from "sequelize";
import { calculateCO2 } from "../../../utils/co2Calculator.js";
import { isValidDate } from "../../../utils/isValidDate.js";

export const filterFlightResolver = async (
  _,
  args,
  { sequelize, redisClient }
) => {
  const { departure_city, destination_city, departure_time } = args;

  if (!departure_city && !destination_city && !departure_time) {
    throw new Error(
      "At least one filter must be provided: departure_city, destination_city, or date."
    );
  }

  const where = {};

  if (departure_city) {
    where.departure_city = departure_city;
  }

  if (destination_city) {
    where.destination_city = destination_city;
  }

  if (departure_time) {
    if (!isValidDate(departure_time)) {
      throw new Error(
        "The 'departure_time' field must be a valid ISO date (YYYY-MM-DD)."
      );
    }
    where.departure_time = {
      [Op.between]: [
        new Date(`${departure_time}T00:00:00Z`),
        new Date(`${departure_time}T23:59:59Z`),
      ],
    };
  }

  const cacheKey = `flights:filter:${JSON.stringify(where)}`;
  const cachedData = await redisClient.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const Flights = sequelize.models.flights;

  const results = await Flights.findAll({ where });

  if (results.length === 0) {
    throw new Error("No flights found for the given criteria.");
  }

  const flights = results.map((flight) => {
    const flightData = flight.get();
    flightData.co2_emission_kg = calculateCO2(flightData.distance_km);

    return flightData;
  });

  await redisClient.set(cacheKey, JSON.stringify(flights), {
    EX: 60 * 5,
  });

  return flights;
};
