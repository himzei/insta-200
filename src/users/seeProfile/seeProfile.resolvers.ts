import client from "../../client";
import { Resolvers } from "../../types";

const Resolvers: Resolvers = {
  Query: {
    seeProfile: (_, { username }) =>
      client.user.findUnique({
        where: {
          username,
        },
        include: {
          following: true,
          followers: true,
        },
      }),
  },
};

export default Resolvers;
