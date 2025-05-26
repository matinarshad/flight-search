import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Flights = sequelize.define(
    "flights",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      flight_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      airline: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      departure_city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      destination_city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      departure_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      arrival_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      distance_km: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "flights",
      timestamps: false,

      validate: {
        departureBeforeArrival() {
          if (this.departure_time >= this.arrival_time) {
            throw new Error("departure_time must be before arrival_time");
          }
        },
      },
    }
  );

  return Flights;
};
