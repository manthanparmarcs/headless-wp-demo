"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { ReactNode } from "react";

const client = new ApolloClient({
  link: new HttpLink({
    uri:
      process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ||
      "https://manthan-parmar-cs-demo.infinityfree.me/graphql",
  }),
  cache: new InMemoryCache(),
});

export function Providers({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}