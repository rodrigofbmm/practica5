
import { MongoClient, Database } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { usuarioSchema, mensajeSchema} from "./schema.ts";

//import { config } from "std/dotenv/mod.ts";

//await config({ export: true, allowEmptyValues: true });

const connectMongoDB = async (): Promise<Database> => {
  const mongo_usr = Deno.env.get("MONGO_USR");
  const mongo_pwd = Deno.env.get("MONGO_PWD");

 if (!mongo_usr || !mongo_pwd ) {
    throw new Error(
      "Missing environment variables, check env.sample for creating .env file"
    );
  }

  const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@cluster0.ern9y.mongodb.net/practica3?authMechanism=SCRAM-SHA-1`;

  const client = new MongoClient();
  await client.connect(mongo_url);
  const db = client.database("practica5");
  return db;
};

const db = await connectMongoDB();
console.info(`MongoDB ${db.name} connected`);

export const usuarioCollection = db.collection<usuarioSchema>("usuario");
export const mensajeCollection = db.collection<mensajeSchema>("mensaje");