import { MongoClient } from "mongodb"; // <- ObjectId usunięty, bo nieużywany
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
  try {
    const db = await connectToDatabase();
    const partsCollection = db.collection("parts");

    switch (req.method) {
      case "GET": {
        const allParts = await partsCollection.find({}).toArray();
        return res.status(200).json(allParts);
      }

      case "POST": {
        const { name, price, partId, categoryId } = req.body;

        if (!name || typeof price === "undefined" || !partId || !categoryId) {
          return res.status(400).json({
            error: "Brak wymaganych pól: nazwa, cena, partId lub categoryId",
          });
        }

        if (isNaN(parseFloat(price))) {
          return res.status(400).json({ error: "Cena musi być liczbą." });
        }

        const newPart = {
          name,
          price: parseFloat(price),
          partId,
          categoryId,
          createdAt: new Date(),
        };

        const result = await partsCollection.insertOne(newPart);
        return res.status(201).json({
          insertedId: result.insertedId,
          message: "Część dodana pomyślnie.",
        });
      }

      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }
  } catch (error) {
    console.error("❌ Błąd w handlerze /api/parts:", error);
    return res.status(500).json({ error: "Wystąpił wewnętrzny błąd serwera." });
  }
}
