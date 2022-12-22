import { Server } from "https://deno.land/std@0.165.0/http/server.ts";
import { GraphQLHTTP } from "https://deno.land/x/gql@1.1.2/mod.ts";
import { makeExecutableSchema } from "https://deno.land/x/graphql_tools@0.0.2/mod.ts";

import { Mutation } from "./resolvers/mutation.ts";
import { typeDefs } from "./schema.ts";
import { Header } from "https://deno.land/x/djwt@v2.8/mod.ts";

const resolvers = {
  Mutation,

};

const s = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    return pathname === "/graphql"
      ? await GraphQLHTTP<Request>({
          schema: makeExecutableSchema({ resolvers, typeDefs }),
          graphiql: true,
          context: (req)  =>{
            const auth = req.headers.get("auth") || "";
            const lang = req.headers.get("lang") || "";
            const user = req.headers.get("user") || "";
            const msg = req.headers.get("msg") || "";
            return{
                auth: auth,
                lang: lang,
                user: user,
                msg: msg
            }
          }
        })(req)
      : new Response("Not Found", { status: 404 });
  },
  port: 3000,
});

s.listenAndServe();

console.log(`Server running on: http://localhost:3000/graphql`);