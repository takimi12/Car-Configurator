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
 * Główny handler API dla ścieżki /api/parts.
 * Obsługuje żądania GET (pobieranie wszystkich części) i POST (dodawanie nowej części).
 * @param {object} req Obiekt żądania HTTP.
 * @param {object} res Obiekt odpowiedzi HTTP.
 */
export default async function handler(req, res) {
  try {
    const db = await connectToDatabase();
    const partsCollection = db.collection("parts");

    switch (req.method) {
      case "GET":
        // Pobierz wszystkie części z kolekcji
        const allParts = await partsCollection.find({}).toArray();
        return res.status(200).json(allParts);

      case "POST":
        // Dodaj nową część do kolekcji
        const { name, price, partId, categoryId } = req.body;

        // Walidacja wymaganych pól
        if (!name || typeof price === "undefined" || !partId || !categoryId) {
          return res
            .status(400)
            .json({
              error: "Brak wymaganych pól: nazwa, cena, partId lub categoryId",
            });
        }

        // Upewnij się, że price jest liczbą
        if (isNaN(parseFloat(price))) {
          return res.status(400).json({ error: "Cena musi być liczbą." });
        }

        // Sprawdź, czy categoryId jest poprawnym ObjectId, jeśli ma być referencją
        // W tym przykładzie zakładamy, że categoryId jest stringiem, ale można dodać walidację ObjectId
        // if (!ObjectId.isValid(categoryId)) {
        //   return res.status(400).json({ error: 'Invalid Category ID format' });
        // }

        const newPart = {
          name,
          price: parseFloat(price), // Zapisz jako numer
          partId,
          categoryId,
          createdAt: new Date(), // Dodaj znacznik czasu utworzenia
        };

        const result = await partsCollection.insertOne(newPart);
        return res
          .status(201)
          .json({
            insertedId: result.insertedId,
            message: "Część dodana pomyślnie.",
          });

      default:
        // Obsługa nieobsługiwanych metod HTTP
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("❌ Błąd w handlerze /api/parts:", error);
    return res.status(500).json({ error: "Wystąpił wewnętrzny błąd serwera." });
  }
}
