import { env } from "./environment";
const MONGODB_URI = env.MONGODB_URI;
const DATABASE_NAME = env.DATABASE_NAME;

import { MongoClient, ServerApiVersion } from "mongodb";

let workoutDatabaseInstance = null;

const mongoClientInstance = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect();
  workoutDatabaseInstance = mongoClientInstance.db(DATABASE_NAME);
};

export const GET_DB = () => {
  if (!workoutDatabaseInstance) {
    throw new Error("Must connect to database first!");
  }
  return workoutDatabaseInstance;
};

export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
};
