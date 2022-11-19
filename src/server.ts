require("dotenv").config();
import { ApolloServer } from "apollo-server-express";
import client from "./client";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
// import { graphqlUploadExpress } from "graphql-upload";
import * as express from "express";
import { graphqlUploadExpress } from "graphql-upload";

const PORT = process.env.PORT;

const startServer = async () => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    // resolver 에 보내기위함
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
        client: client,
      };
    },
  });
  await server.start();
  const app = express();
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });
  await new Promise((func: any) => app.listen({ port: PORT }, func));
  console.log(`🚀 Server: http://localhost:${PORT}${server.graphqlPath}`);
};

startServer();
