import "dotenv/config";

import cors from "cors";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";

const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async () => ({
    models,
    me: await models.User.findByLogin("beans1"),
  }),
});

server.applyMiddleware({ app, path: "/graphql" });

const eraseDatabaseOnSync = true;
// remove force tag
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }
  app.listen({ port: 8000 }, () => {
    console.log("Apollo Server on http://localhost:8000/graphql");
  });
});

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: "beans1",
      messages: [
        {
          text: "making poc",
        },
      ],
    },
    {
      include: [models.Message],
    }
  );
  await models.User.create(
    {
      username: "beans2",
      messages: [
        {
          text: "known how to do this...",
        },
        {
          text: "...just to do something",
        },
      ],
    },
    {
      include: [models.Message],
    }
  );
};
