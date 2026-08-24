import mongoose from "mongoose";

export const ConnectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.URI);

    console.log("✅ Connected to Database");
    console.log("Database:", connection.connection.name);
    console.log("Host:", connection.connection.host);
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  }
};

export default ConnectDb;