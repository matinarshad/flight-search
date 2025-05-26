export const seedFlights = async (Flights) => {
  const count = await Flights.count();

  if (count > 0) {
    console.log("Flights already seeded, skipping seeding.");
    return;
  }

  await Flights.bulkCreate([
    {
      flight_number: "AB123",
      airline: "AirBlue",
      departure_city: "New York",
      destination_city: "London",
      departure_time: new Date("2025-06-01T10:00:00Z"),
      arrival_time: new Date("2025-06-01T20:00:00Z"),
      price: 500,
      distance_km: 5570,
    },
    {
      flight_number: "CD456",
      airline: "SkyHigh",
      departure_city: "Paris",
      destination_city: "Berlin",
      departure_time: new Date("2025-06-02T08:00:00Z"),
      arrival_time: new Date("2025-06-02T10:00:00Z"),
      price: 120,
      distance_km: 1050,
    },
    {
      flight_number: "EF789",
      airline: "JetSet",
      departure_city: "Tokyo",
      destination_city: "Seoul",
      departure_time: new Date("2025-07-01T06:00:00Z"),
      arrival_time: new Date("2025-07-01T08:30:00Z"),
      price: 220,
      distance_km: 1150,
    },
    {
      flight_number: "GH012",
      airline: "CloudAir",
      departure_city: "Los Angeles",
      destination_city: "San Francisco",
      departure_time: new Date("2025-06-10T14:00:00Z"),
      arrival_time: new Date("2025-06-10T15:15:00Z"),
      price: 90,
      distance_km: 560,
    },
    {
      flight_number: "IJ345",
      airline: "FlyHigh",
      departure_city: "Dubai",
      destination_city: "Mumbai",
      departure_time: new Date("2025-06-15T09:00:00Z"),
      arrival_time: new Date("2025-06-15T12:00:00Z"),
      price: 300,
      distance_km: 2000,
    },
    {
      flight_number: "KL678",
      airline: "SkyBound",
      departure_city: "Sydney",
      destination_city: "Melbourne",
      departure_time: new Date("2025-06-20T11:00:00Z"),
      arrival_time: new Date("2025-06-20T12:30:00Z"),
      price: 150,
      distance_km: 720,
    },
  ]);

  console.log("Flights seeded");
};
