import dotenv from "dotenv";
import connectDB from "./db/dbconnect_promise.js";
import { app } from "./app.js";
import colors from "colors";
dotenv.config({
  path: "./env",
});

connectDB()
  .then((res) => {
    app.on("error", (error) => {
      console.log("Error on App while listening : ", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(
        `Server is listening on PORT number:  ${process.env.PORT}`.yellow
      );
    });
  })
  .catch((err) => {
    console.log(`MongoDB Connection failed!!!`, err);
  });
