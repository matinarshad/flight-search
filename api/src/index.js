import dotenv from "dotenv";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import Redis from "redis";
import { Sequelize } from "sequelize";
import typeDefs from "./graphql/flights/schema/schema.js";
import resolvers from "./graphql/flights/resolvers/index.js";
import { seedFlights } from "./db/seeds/flights.js";
import { createFlightsTable } from "./db/tables/flights.js";
import defineFlightsModel from "./models/flights.js";

dotenv.config();

const startServer = async () => {
  const app = express();

  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
  });

  const Flights = defineFlightsModel(sequelize);

  try {
    await sequelize.authenticate();
    console.log("Database is connected.");

    await createFlightsTable(sequelize);

    await seedFlights(Flights);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }

  // Setup Redis client
  const redisClient = Redis.createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on("error", (err) => console.error("Redis Client Error", err));

  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (err) {
    console.error("Redis connection failed:", err);
  }

  // Create Apollo server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ sequelize, redisClient }),
  });

  try {
    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(
        `Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
