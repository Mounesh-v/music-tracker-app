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
    cached.promise = mongoose.connect(process.env.URI).then((connection) => {
      console.log("Connected to Database:", connection.connection.name);
      return connection;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default ConnectDb;