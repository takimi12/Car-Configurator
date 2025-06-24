// pages/api/parts.js
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// Użyj tego samego URI, co w pliku categories API
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://tomek12olech:7MytflC2STM5Wroe@cluster.etrcyrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster";
const dbName = "Cars"; // Nazwa bazy danych

// Sprawdzanie, czy URI jest ustawione
if (!uri) {
  console.error("❌ Missing MongoDB connection string in MONGODB_URI");
  throw new Error("MONGODB_URI not set");
}

// Zmienna do buforowania klienta MongoDB, aby uniknąć wielokrotnego łączenia
let cachedClient = null;

// Główna funkcja handlera API dla Next.js
export default async function handler(req, res) {
  // Nawiąż połączenie z MongoDB, jeśli jeszcze nie jest połączone
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
      cachedClient = client; // Buforuj połączenie
      console.log("✅ MongoDB connected successfully for parts API.");
    } catch (err) {
      console.error("❌ MongoDB connection error:", err);
      return res.status(500).json({ error: "Failed to connect to database" });
    }
  }

  // Uzyskaj dostęp do bazy danych i kolekcji 'parts'
  const db = cachedClient.db(dbName);
  const partsCollection = db.collection("parts");

  try {
    // Obsługa żądania POST: dodawanie nowej części
    if (req.method === "POST") {
      const newPart = req.body;
      if (!newPart || Object.keys(newPart).length === 0) {
        return res.status(400).json({ error: "Request body cannot be empty" });
      }
      const result = await partsCollection.insertOne(newPart);
      return res.status(201).json({
        insertedId: result.insertedId,
        message: "Part added successfully",
      });
    }

    // Obsługa żądania GET: pobieranie części
    if (req.method === "GET") {
      const { id } = req.query; // Sprawdź, czy przekazano ID w zapytaniu

      if (id) {
        // Jeśli ID jest obecne, pobierz pojedynczą część
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid part ID" });
        }
        const part = await partsCollection.findOne({ _id: new ObjectId(id) });
        if (!part) {
          return res.status(404).json({ error: "Part not found" });
        }
        return res.status(200).json(part);
      } else {
        // Jeśli ID nie jest obecne, pobierz wszystkie części
        const allParts = await partsCollection.find({}).toArray();
        return res.status(200).json(allParts);
      }
    }

    // Obsługa żądania DELETE: usuwanie części po ID
    if (req.method === "DELETE") {
      const { id } = req.query; // ID powinno być przekazane jako parametr zapytania

      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid or missing part id" });
      }

      const result = await partsCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Part not found" });
      }

      return res.status(200).json({ message: "Part deleted successfully" });
    }

    // Jeśli metoda HTTP nie jest obsługiwana
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("❌ API handler error:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
}
