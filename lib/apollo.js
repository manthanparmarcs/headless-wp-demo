import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "http://graphql-practise.local/graphql",
  cache: new InMemoryCache(),
});