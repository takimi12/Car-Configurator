import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://tomek12olech:7MytflC2STM5Wroe@cluster.etrcyrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster";
const dbName = "Cars";

if (!uri) {
  console.error("❌ Brak ciągu połączenia MongoDB w MONGODB_URI");
  throw new Error("MONGODB_URI nie jest ustawione");
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
      console.error("❌ Błąd połączenia z MongoDB:", err);
      return res
        .status(500)
        .json({ error: "Nie udało się połączyć z bazą danych" });
    }
  }

  const db = cachedClient.db(dbName);
  const categoriesCollection = db.collection("categories");
  const partsCollection = db.collection("parts"); // Zakładam, że masz kolekcję 'parts'

  try {
    if (req.method === "POST") {
      const result = await categoriesCollection.insertOne(req.body);
      return res.status(201).json({
        insertedId: result.insertedId,
        message: "Kategoria dodana pomyślnie",
      });
    }

    if (req.method === "GET") {
      const data = await categoriesCollection.find({}).toArray();
      return res.status(200).json(data);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({
          error: "Nieprawidłowy lub brakujący identyfikator kategorii",
        });
      }

      // Możesz rozpocząć sesję dla transakcji, aby zapewnić atomowość
      // const session = cachedClient.startSession();
      // session.startTransaction();

      try {
        // Usuń wszystkie części powiązane z tą kategorią
        const deletePartsResult = await partsCollection.deleteMany({
          categoryId: new ObjectId(id), // Zakładam, że części odwołują się do kategorii przez categoryId
        });
        console.log(
          `Usunięto ${deletePartsResult.deletedCount} części dla kategorii ${id}`,
        );

        // Następnie usuń kategorię
        const result = await categoriesCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          // await session.abortTransaction();
          return res.status(404).json({ error: "Kategoria nie znaleziona" });
        }

        // await session.commitTransaction();
        return res
          .status(200)
          .json({ message: "Kategoria usunięta pomyślnie" });
      } catch (transactionError) {
        // await session.abortTransaction();
        console.error("❌ Transakcja nie powiodła się:", transactionError);
        return res.status(500).json({
          error: "Nie udało się usunąć kategorii i powiązanych części",
          details: transactionError.message,
        });
      } finally {
        // session.endSession();
      }
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).end(`Metoda ${req.method} Niedozwolona`);
  } catch (err) {
    console.error("❌ Błąd handlera API:", err);
    return res
      .status(500)
      .json({ error: "Wewnętrzny błąd serwera", details: err.message });
  }
}
