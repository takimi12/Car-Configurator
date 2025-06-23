import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://tomek12olech:7MytflC2STM5Wroe@cluster.etrcyrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster";
const dbName = "Cars";

if (!uri) {
  console.error("❌ Missing MongoDB connection string in MONGODB_URI");
  throw new Error("MONGODB_URI not set");
}

let cachedClient = null;

export default async function handler(req, res) {
  if (!cachedClient) {
    try {
      const client = new MongoClient(uri, {
        serverApi: {
          version: "1",
          strict: true,
          deprecationErrors: true,
        },
      });
      await client.connect();
      cachedClient = client;
    } catch (err) {
      console.error("❌ MongoDB connection error:", err);
      return res.status(500).json({ error: "Failed to connect to database" });
    }
  }

  const db = cachedClient.db(dbName);
  const categoriesCollection = db.collection("categories");

  try {
    if (req.method === "POST") {
      const result = await categoriesCollection.insertOne(req.body);
      return res.status(201).json({
        insertedId: result.insertedId,
        message: "Category added successfully",
      });
    }

    if (req.method === "GET") {
      const data = await categoriesCollection.find({}).toArray();
      return res.status(200).json(data);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid or missing category id" });
      }

      const result = await categoriesCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      return res.status(200).json({ message: "Category deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("❌ API handler error:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
}
