const express = require("express");
const urlRoute = require("./routes/url.routes.js");
const { connectToMongoDB } = require("./connection.js");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 8001;
const MONGO_URL = process.env.MONGO_CONNECTION_STRING;

(async () => {
  try {
    await connectToMongoDB(MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Failed to connect to MongoDB", error));

    app.use(express.json());
    app.use("/", urlRoute);

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
})();
