import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );

    // this is for connecting to nosqlbooster for mongoDB interface
    // const connectionInstance = await mongoose.connect(
    //   `${process.env.MONGODB_URL}`

    // );
    console.log(
      `\n MongoDB Connected Successfully!!  DB_HOST ${connectionInstance.connection.host}`
        .yellow
    );
  } catch (error) {
    console.log("MongoDB Connection error: ", error.message);
    process.exit(1);
  }
};

export default connectDB;
