import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Flight {
    id: ID!
    flight_number: String!
    airline: String!
    departure_city: String!
    destination_city: String!
    departure_time: String!
    arrival_time: String!
    price: Float!
    distance_km: Float!
    co2_emission_kg: Float!
    duration: Float
  }

  type Query {
    allFlights: [Flight!]!

    filterFlights(
      departure_city: String
      destination_city: String
      departure_time: String
    ): [Flight!]!

    sortFlights(sortBy: String = "price", order: String = "ASC"): [Flight!]!
  }
`;

export default typeDefs;
