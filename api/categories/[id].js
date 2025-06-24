import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = "Cars";

let cachedClient = null;

async function connectToDatabase() {
  if (!cachedClient) {
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
  }
  return cachedClient.db(dbName);
}

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    query: { id },
  } = req;

  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid or missing category id" });
  }

  try {
    const db = await connectToDatabase();
    const categoriesCollection = db.collection("categories");

    const result = await categoriesCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("❌ Delete handler error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
