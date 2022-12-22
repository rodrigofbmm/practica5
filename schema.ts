import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

export const typeDefs = gql`
type usuario {
    username: String!
    password: String
    fecha: Float!
    idioma: String!
}

type mensaje {
    envio: String!
    destino: String!
    mensaje: String!
    fecha: Float!
} 
type Query{
    getMessages(pages: String!, perPage: String!): [mensaje!]!
}

type Mutation {
    createUser(username: String!, password: String!): usuario!
    login (username: String!, password: String!): String!
    deleteUser: String!
    sendMessage(destino: String!, mensaje: String!): mensaje!
  }
`;