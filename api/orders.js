// pages/api/orders.js
import { MongoClient, ObjectId } from "mongodb"; // ObjectId może być potrzebny do przyszłych operacji
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
      console.log("✅ MongoDB connected successfully for orders API.");
    } catch (err) {
      console.error("❌ MongoDB connection error:", err);
      return res.status(500).json({ error: "Failed to connect to database" });
    }
  }

  // Uzyskaj dostęp do bazy danych i kolekcji 'orders'
  const db = cachedClient.db(dbName);
  const ordersCollection = db.collection("orders");

  try {
    // Obsługa żądania POST: dodawanie nowego zamówienia
    if (req.method === "POST") {
      const newOrder = req.body;
      if (!newOrder || Object.keys(newOrder).length === 0) {
        return res.status(400).json({ error: "Request body cannot be empty" });
      }
      const result = await ordersCollection.insertOne(newOrder);
      return res.status(201).json({
        insertedId: result.insertedId,
        message: "Order added successfully",
      });
    }

    // Obsługa żądania GET: pobieranie wszystkich zamówień
    if (req.method === "GET") {
      const allOrders = await ordersCollection.find({}).toArray();
      return res.status(200).json(allOrders);
    }

    // Jeśli metoda HTTP nie jest obsługiwana
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("❌ API handler error:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
}