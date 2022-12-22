import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { usuarioCollection,mensajeCollection } from "../db/db.ts";
import { usuarioSchema,mensajeSchema } from "../db/schema.ts";
import { usuario,mensaje } from "../types.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { createJWT, verifyJWT } from "../lib/jwt.ts";
import { create, Header, Payload, verify } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { isDBRefLike } from "https://deno.land/x/web_bson@v0.2.5/src/db_ref.ts";

export const Mutation = {
    createUser: async (
    _: unknown,
    args: {
      username: string;
      password: string;
    },
    ctx:{
        auth:string;
        lang:string;
    }
  ): Promise<usuario> => {
    try {
      if(!ctx.lang){
        throw new Error("no has introducido el idioma ");
      }
      const user = await usuarioCollection.findOne({
        username: args.username,
      });
      if (user) {
        throw new Error("User already exists");
      }
      const hashedPassword = await bcrypt.hash(args.password);
      const now =  new Date();
      const _id = new ObjectId();

      await usuarioCollection.insertOne({
        username: args.username,
        password: hashedPassword,
        fecha: now.getDate(),
      });
      return {
        username: args.username,
        password: hashedPassword,
        fecha: now.getDate(),
        idioma: ctx.lang,
      };
    } catch (e) {
      throw new Error(e);
    }
  },

  login: async (
    _: unknown,
    args: {
      username: string;
      password: string;
    }
  ): Promise<string> => {
    try {
      const user: usuarioSchema | undefined = await usuarioCollection.findOne({
        username: args.username,
      });
      if (!user) {
        throw new Error("User does not exist");
      }
      const validPassword = await bcrypt.compare(args.password, user.password || "");
      if (!validPassword) {
        throw new Error("Invalid password");
      }
      const now =  new Date();
      const token = await createJWT(
        {
          username: user.username,
          fecha: now.getDate(),
        },
        "my-super-secret"
      );
      console.log(token);
      return token;
    } catch (e) {
      throw new Error(e);
    }
  },

  deleteUser: async (
    _: unknown,
    ctx:{
      auth:string;
      user:string;
  }
  ): Promise<string> => {
    try {

      const validtoken = await verifyJWT(ctx.auth, "my-super-secret"|| "");
      if (!validtoken) {
        throw new Error("token es incorrecto");
      }

      const user: usuarioSchema | undefined = await usuarioCollection.findOne({
        username: ctx.user,
      });
      if (!user) {
        throw new Error("User does not exist");
      }
      
      await usuarioCollection.deleteOne({username: ctx.user});
      return "usuario borrado";

    } catch (e) {
      throw new Error(e);
    }
  },

  sendMessage: async (
    _: unknown,
    args: {
      destino: string;
      mensaje: string;
    },
    ctx:{
      auth:string;
      user:string;
      lang:string;
  }
  ): Promise<mensaje> => {
    try {

      if(!ctx.auth){
        throw new Error("token de inicio de sesion");
      }
      
      if(!ctx.user){
        throw new Error("falta introducir quien es el que envia el mensaje");
      }

      if(!ctx.lang){
        throw new Error("no has introducido el idioma del mensaje");
      }

      const validtoken = await verifyJWT(ctx.auth, "my-super-secret"|| "");
      if (!validtoken) {
        throw new Error("token es incorrecto");
      }

      const user: usuarioSchema | undefined = await usuarioCollection.findOne({
        username: ctx.user,
      });
      if (!user) {
        throw new Error("persona que envia no existe");
      }

      const destino: usuarioSchema | undefined = await usuarioCollection.findOne({
        username: args.destino,
      });
      if(!destino){
        throw new Error("destinatario no existe");
      } 
    
      const now =  new Date();

      await mensajeCollection.insertOne({
        envio: ctx.user,
        destino: args.destino,
        mensaje: args.mensaje,
        fecha: now.getDate(),
      });
      return {
        envio: ctx.user,
        destino: args.destino,
        mensaje: args.mensaje,
        fecha: now.getDate(),
      };
      
    } catch (e) {
      throw new Error(e);
    }
  },
};