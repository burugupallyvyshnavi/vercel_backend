import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// -------- MONGO CONNECTION --------
const client = new MongoClient(process.env.MONGO_URI);

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

connectDB();

// -------- API: RECEIVE ALL FORM DATA --------
app.post("/submit", async (req, res) => {
  try {
    const data = req.body; // everything from script.js

    // Use database "aruhDB" and collection "leads"
    const db = client.db("aruhDB");
    const leads = db.collection("leads");

    // Save the data
    await leads.insertOne({
      ...data,
      created_at: new Date()
    });

    return res.json({ message: "Form saved successfully!" });

  } catch (err) {
    console.error("Error saving form:", err);
    return res.status(500).json({ message: "Failed to save form" });
  }
});

// -------- START SERVER --------
app.listen(3000, () => {
  console.log("Backend running at http://localhost:3000");
});
