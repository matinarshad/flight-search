# Flight Search API

## Overview

This project is a flight search application that calculates CO₂ emissions for each flight based on flight distance. The application is built using Node.js, Redis, PostgreSQL, Docker, and Apollo GraphQL.

## Features

- **Flight Search**: Filter flights based on departure city, destination city, and departure time (date).
- **Flight Details**: Return flight details including flight number, airline, departure time, arrival time, price, and CO₂ emissions.
- **CO₂ Emissions Calculation**: Calculate CO₂ emissions based on flight distance.
- **Error Handling**: Handle edge cases such as no flights found, invalid dates, etc.
- **Flight Sorting**: Sorting of flights by price, duration, or departure time.
- **Filtering**: Filtering by airline or price range.
- **Caching**: Cache GraphQL query results using Redis for improved performance.
- **Logging**: Utilizes Winston to capture informational and error logs.

## Getting Started

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/matinarshad/flight-search.git
   cd flight-search/api
   npm install

2. Set up Backend server by creating `.env` in `api` directory, use below as an example or check `.env.example`, PostgreSQL and Redis:
   ```bash
   POSTGRES_USER=user
   POSTGRES_PASSWORD=strongpassword
   POSTGRES_DB=flights_db
   DATABASE_URL=postgres://user:strongpassword@postgres:5432/flights_db
   REDIS_URL=redis://redis:6379

- Then, run the following command to build and start your services:
  ```bash
  docker compose up --build

- Wait until the database is connected — you should see the message "Database is connected" in the logs of the API Docker container.

3. Navigate to [http://localhost:4000/graphql](http://localhost:4000/graphql) to run GraphQL queries:

4. **Filter flights by departure city, destination city, and date:**

   ```graphql
   query {
     filterFlights(
       departure_city: "New York"
       destination_city: "London"
       date: "2025-06-01"
     ) {
       flight_number
       airline
       departure_time
       arrival_time
       price
       distance_km
       co2_emission_kg
     }
   }

5. **Filter flights by departure city, destination city, and date:**

   ```graphql
   query {
    filterFlights(
      departure_city: "New York"
      destination_city: "London"
      departure_time: "2025-06-01"
      ) {
      flight_number
      airline
      departure_time
      arrival_time
      price
      distance_km
      co2_emission_kg
      }
   }

6. **Sort flights by duration (also supports sorting by price or departure time):**

   ```graphql
   query {
    sortFlights(sortBy: "duration", order: "ASC") {
      flight_number
      price
      duration
    }
   }

### Design Decisions
- Database: PostgreSQL is chosen for its robust relational data handling.
- Caching: Redis is used to cache query results and reduce database load.
### Future Improvements
- Add testing
- Consider adding indexing for efficient query
- Add duration as database column, database trigger to calculate automatically the duration of the fligh rather than doing at API
- Add user authentication (maybe by using coginito pool).
- Implement pagination for flight results to not overload the server.

### Scaling and Bottlenecks

1. **Scalability**
   - The backend can handle concurrent requests efficiently 
   - Redis caching helps to reduce database load and improves performance.

2. **Potential Bottlenecks**
   - Running a single backend instance limits scalability. It can become a bottleneck under high traffic unless horizontally scaled.
   - If key columns (e.g., departure_city, destination_city, departure_time) aren't indexed in PostgreSQL, read operations could be significantly slower as data scales.


### Data Storage and Schema

#### PostgreSQL Schema For Flight Table

- **flights**
  - `id`: Serial, Primary Key
  - `flight_number`: Varchar(10)
  - `airline`: Varchar(100)
  - `departure_city`: Varchar(100)
  - `destination_city`: Varchar(100)
  - `departure_time`: Timestamptz
  - `arrival_time`: Timestamptz
  - `price`: Decimal
  - `distance_km`: Decimal
  - `created_at`: Timestamptz
  - `updated_at`: Timestamptz

## Conclusion

The Flight Search API is a reliable and efficient system built to manage flight searches while calculating CO₂ emissions. By leveraging caching and asynchronous processing, it delivers high performance and scalable operation.
