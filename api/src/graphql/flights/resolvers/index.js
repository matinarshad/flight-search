import { allFlightResolvers } from "./allFlightResolvers.js";
import { filterFlightResolver } from "./filterFlightResolver.js";
import { sortFlightResolver } from "./sortFlightResolver.js";

export default {
  Query: {
    allFlights: allFlightResolvers,
    filterFlights: filterFlightResolver,
    sortFlights: sortFlightResolver,
  },
};
