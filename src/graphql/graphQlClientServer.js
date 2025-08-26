import { GraphQLClient } from "graphql-request";
export const graphcms = new GraphQLClient(process.env.NEXT_PUBLIC_NEXT_GRAPHQL_URL, {
  cache: "no-store",
});