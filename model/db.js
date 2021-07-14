const mongoose = require("mongoose");
require("dotenv").config();
let uriDbnull = null;

if (process.env.NODE_ENV === "test") {
  uriDb = process.env.URI_DB_TEST;
} else {
  uriDb = process.env.URI_DB;
}

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  poolSize: 5,
});

if (process.env.NODE_ENV !== "test") {
  mongoose.connection.on("connected", () => {
    console.log("Database connection successful");
  });

  mongoose.connection.on("error", (e) => {
    console.log(`Connection open ${e.message}`);
  });

  mongoose.connection.on("disconnected", (e) => {
    console.log(`Mongoose disconnected`);
  });
}
process.on("SIGINT", async () => {
  mongoose.connection.close(() => {
    console.log("Connection to DB terminated");
    process.exit(1);
  });
});

module.exports = db;
