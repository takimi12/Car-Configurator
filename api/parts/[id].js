import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = "Cars";

let cachedClient = null;

async function connectToDatabase() {
  if (!cachedClient) {
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    console.log("✅ Połączono z bazą danych MongoDB.");
  }
  return cachedClient.db(dbName);
}

export default async function handler(req, res) {
  const {
    query: { id },
  } = req;

  if (!id || !ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ error: "Nieprawidłowe lub brakujące ID części." });
  }

  try {
    const db = await connectToDatabase();
    const partsCollection = db.collection("parts");
    const objectId = new ObjectId(id);

    switch (req.method) {
      case "GET": { 
        const part = await partsCollection.findOne({ _id: objectId });

        if (!part) {
          return res.status(404).json({ error: "Część nie znaleziona." });
        }
        return res.status(200).json(part);
      } 

      case "DELETE": { 
        const result = await partsCollection.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Część nie znaleziona." });
        }
        return res.status(200).json({ message: "Część usunięta pomyślnie." });
      } 

      default:
        res.setHeader("Allow", ["GET", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("❌ Błąd w handlerze /api/parts/[id]:", error);
    return res.status(500).json({ error: "Wystąpił wewnętrzny błąd serwera." });
  }
}