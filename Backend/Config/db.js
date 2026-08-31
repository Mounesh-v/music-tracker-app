import mongoose from "mongoose";

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const ConnectDb = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI || process.env.URI;
    if (!uri) {
      throw new Error("MONGODB_URI or URI environment variable is not set");
    }
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    }).then((connection) => {
      console.log("Connected to Database:", connection.connection.name);
      return connection;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default ConnectDb;
