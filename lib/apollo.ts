// /lib/apollo.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Create a proper HttpLink pointing to WordPress GraphQL endpoint
const link = new HttpLink({
  uri:
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ||
    "https://wordpress-401163-6209935.cloudwaysapps.com/graphql",
  credentials: "same-origin", // optional, for cookies/auth
});

// Initialize Apollo Client
export const client = new ApolloClient({
  link,                 // ✅ must use link
  cache: new InMemoryCache(),
});