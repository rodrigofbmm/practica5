
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { usuarioSchema } from "../db/schema.ts";
import { usuario } from "../types.ts";

const UserResolver = {
  id: (parent: usuarioSchema | usuario) =>
    (parent as usuario).username
      ? (parent as usuario).username
      : new ObjectId((parent as usuarioSchema)._id),
};

export default UserResolver;