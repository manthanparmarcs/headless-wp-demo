import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://manthan-parmar-cs-demo.infinityfree.me/graphql",
  cache: new InMemoryCache(),
});