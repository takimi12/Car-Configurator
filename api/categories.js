// api/categories.js
import { MongoClient } from "mongodb"; // Usunięto ObjectId, ponieważ nie jest używane w GET/POST na poziomie całej kolekcji
import dotenv from "dotenv"; // Pozostawiono dla spójności lokalnego developmentu

// Załaduj zmienne środowiskowe
dotenv.config();

// Połączenie MongoDB URI
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://tomek12olech:7MytflC2STM5Wroe@cluster.etrcyrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster";
const dbName = "Cars"; // Zgodnie z Twoją oryginalną nazwą bazy danych

// Sprawdzenie, czy URI jest ustawione
if (!uri) {
  console.error("❌ Missing MongoDB connection string in MONGODB_URI");
  throw new Error("MONGODB_URI not set");
}

// Zmienna globalna dla buforowania klienta MongoDB
let cachedClient = null;

// Główna funkcja handlera dla Vercel API Route
export default async function handler(req, res) {
  // Sprawdź i połącz się z bazą danych, jeśli nie ma buforowanego klienta
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
  const categoriesCollection = db.collection("categories"); // Zmieniłem nazwę zmiennej dla czytelności

  try {
    if (req.method === "POST") {
      // Dodaj nową kategorię
      const result = await categoriesCollection.insertOne(req.body);
      return res.status(201).json({
        insertedId: result.insertedId,
        message: "Category added successfully",
      });
    }

    if (req.method === "GET") {
      // Pobierz wszystkie kategorie
      const data = await categoriesCollection.find({}).toArray();
      return res.status(200).json(data);
    }

    // Obsługa nieobsługiwanych metod HTTP
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("❌ API handler error:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
}
