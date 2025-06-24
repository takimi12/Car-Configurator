import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI; // Użyj zmiennej środowiskowej dla URI
const dbName = "Cars";

let cachedClient = null; // Cache'owanie połączenia z bazą danych

/**
 * Funkcja do nawiązywania połączenia z bazą danych MongoDB.
 * Jeśli połączenie jest już nawiązane, używa istniejącego klienta.
 * @returns {Promise<Db>} Obiekt bazy danych MongoDB.
 */
async function connectToDatabase() {
  if (!cachedClient) {
    if (!uri) {
      // Zabezpieczenie na wypadek braku MONGODB_URI
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    console.log("✅ Połączono z bazą danych MongoDB.");
  }
  return cachedClient.db(dbName);
}

/**
 * Główny handler API dla ścieżki /api/parts/[id].
 * Obsługuje żądania GET (pobieranie pojedynczej części) i DELETE (usuwanie części).
 * @param {object} req Obiekt żądania HTTP.
 * @param {object} res Obiekt odpowiedzi HTTP.
 */
export default async function handler(req, res) {
  const {
    query: { id }, // Pobierz ID z parametrów URL
  } = req;

  // Sprawdź, czy ID jest obecne i jest poprawnym ObjectId
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
      case "GET":
        // Pobierz pojedynczą część po jej ID
        const part = await partsCollection.findOne({ _id: objectId });

        if (!part) {
          return res.status(404).json({ error: "Część nie znaleziona." });
        }
        return res.status(200).json(part);

      case "DELETE":
        // Usuń część po jej ID
        const result = await partsCollection.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Część nie znaleziona." });
        }
        return res.status(200).json({ message: "Część usunięta pomyślnie." });

      default:
        // Obsługa nieobsługiwanych metod HTTP
        res.setHeader("Allow", ["GET", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("❌ Błąd w handlerze /api/parts/[id]:", error);
    return res.status(500).json({ error: "Wystąpił wewnętrzny błąd serwera." });
  }
}
