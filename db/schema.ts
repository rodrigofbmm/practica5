import { mensaje, usuario } from "../types.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";


export type usuarioSchema = usuario & {
    _id: ObjectId;
};

export type mensajeSchema = mensaje & {
    _id: ObjectId;
};
