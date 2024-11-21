const { MongoClient } = require("mongodb");
require('dotenv').config(); // Ensure you have dotenv for environment variables
const url = process.env.MONGODB_URI;
const dbName = "xeno-mini-crm";

let db;

const connectDB = async () => {
  if (db) {
    console.log(`Already connected to the database: ${dbName}`);
    return;
  }

  const client = new MongoClient(url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    ssl: true,  // Ensure SSL is enabled (important for Atlas)
  });

  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to database");
  }
};

// Get the database instance
const getDB = () => {
  if (!db) {
    throw new Error("Database connection is not established");
  }
  return db;
};

module.exports = { connectDB, getDB };