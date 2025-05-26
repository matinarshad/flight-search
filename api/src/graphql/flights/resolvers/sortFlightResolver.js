const VALID_SORT_FIELDS = ["price", "departure_time", "duration"];

export const sortFlightResolver = async (
  _,
  args,
  { sequelize, redisClient }
) => {
  const { sortBy = "price", order = "ASC" } = args;

  if (!VALID_SORT_FIELDS.includes(sortBy)) {
    throw new Error(
      `Invalid sortBy field. Must be one of: ${VALID_SORT_FIELDS.join(", ")}`
    );
  }

  const orderDirection = order.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const cacheKey = `flights:sort:${sortBy}:${orderDirection}`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const Flights = sequelize.models.flights;

  if (sortBy === "duration") {
    let flights = await Flights.findAll();

    if (flights.length === 0) {
      throw new Error("No flights available.");
    }

    flights = flights.map((flight) => {
      const flightData = flight.get();
      flightData.duration = parseFloat(
        (
          (new Date(flightData.arrival_time) -
            new Date(flightData.departure_time)) /
          (1000 * 60 * 60)
        ).toFixed(2)
      );

      return flightData;
    });

    flights.sort((a, b) =>
      orderDirection === "ASC"
        ? a.duration - b.duration
        : b.duration - a.duration
    );

    await redisClient.set(cacheKey, JSON.stringify(flights), { EX: 60 * 5 });
    return flights;
  } else {
    const flights = await Flights.findAll({
      order: [[sortBy, orderDirection]],
    });

    if (flights.length === 0) {
      throw new Error("No flights available.");
    }

    const result = flights.map((flight) => {
      const flightData = flight.get();
      flightData.duration = parseFloat(
        (
          (new Date(flightData.arrival_time) -
            new Date(flightData.departure_time)) /
          (1000 * 60 * 60)
        ).toFixed(2)
      );

      return flightData;
    });

    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 60 * 5 });
    return result;
  }
};
