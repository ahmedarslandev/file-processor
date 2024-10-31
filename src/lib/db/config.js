import mongoose from "mongoose";
import { config } from "dotenv";

config();

const MONGO_URI = process.env.MONGODB_URI;
const MONGO_NAME = process.env.MONGODB_NAME;


const cached = {};
async function connectMongo() {
  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local"
    );
  }
  if (cached.connection) {
    console.log("Mongoose connection is available already");
    return cached.connection;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGO_NAME,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts);
    console.log("Mongoose connectioned successfully");
  }
  try {
    cached.connection = await cached.promise;
  } catch (e) {
    cached.promise = undefined;
    throw e;
  }
  return cached.connection;
}

export default connectMongo;
