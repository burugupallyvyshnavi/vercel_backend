import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    await client.connect();

    const db = client.db("aruhbackend");
    const leads = db.collection("leads");

    await leads.insertOne({
      ...req.body,
      created_at: new Date()
    });

    res.status(200).json({ message: "Form saved successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}
