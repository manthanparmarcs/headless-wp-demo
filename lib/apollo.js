import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://wordpress-401163-6209935.cloudwaysapps.com/graphql",
  cache: new InMemoryCache(),
});