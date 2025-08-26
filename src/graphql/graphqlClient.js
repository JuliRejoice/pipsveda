"use client"
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
  uri:  process.env.NEXT_PUBLIC_NEXT_GRAPHQL_URL,
});


const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;