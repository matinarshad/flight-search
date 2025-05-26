import logger from "../../utils/logger.js";

export async function createFlightsTable(sequelize) {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS flights (
      id SERIAL PRIMARY KEY,
      flight_number VARCHAR(10) UNIQUE NOT NULL,
      airline VARCHAR(100) NOT NULL,
      departure_city VARCHAR(100) NOT NULL,
      destination_city VARCHAR(100) NOT NULL,
      departure_time TIMESTAMPTZ NOT NULL,
      arrival_time TIMESTAMPTZ NOT NULL,
      price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
      distance_km INTEGER NOT NULL CHECK (distance_km >= 0),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ,
      CHECK (departure_time < arrival_time)
    );

    COMMENT ON COLUMN flights.id IS 'Primary key for the flight record';
    COMMENT ON COLUMN flights.flight_number IS 'Unique flight number identifier';
    COMMENT ON COLUMN flights.airline IS 'Name of the airline';
    COMMENT ON COLUMN flights.departure_city IS 'City where the flight departs';
    COMMENT ON COLUMN flights.destination_city IS 'City where the flight arrives';
    COMMENT ON COLUMN flights.departure_time IS 'Time the flight departs (with timezone)';
    COMMENT ON COLUMN flights.arrival_time IS 'Time the flight arrives (with timezone)';
    COMMENT ON COLUMN flights.price IS 'Ticket price in USD';
    COMMENT ON COLUMN flights.distance_km IS 'Flight distance in kilometers';
    COMMENT ON COLUMN flights.created_at IS 'Timestamp when the record was created';
    COMMENT ON COLUMN flights.updated_at IS 'Timestamp when the record was last updated';
  `;

  try {
    await sequelize.query(createTableSQL);
    logger.info("Flights table created (if not exists)");
  } catch (error) {
    logger.error("Error creating flights table:", error);
    throw error;
  }
}
