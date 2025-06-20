// @ts-ignore
const { MongoClient, ObjectId } = require("mongodb");

// @ts-ignore
const uri = process.env.MONGODB_URI || "";

if (!uri) {
  console.error("❌ Missing MongoDB connection string in MONGODB_URI");
  throw new Error("MONGODB_URI not set");
}

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

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
    cachedDb = client.db("car-configurator-db");
    return { client: cachedClient, db: cachedDb };
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw new Error("Failed to connect to database");
  }
}

// @ts-ignore
module.exports = async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { id } = req.query; // id będzie dostępne z dynamicznej trasy
    const categoriesCollection = db.collection("categories");
    const partsCollection = db.collection("parts"); // Potrzebne do usuwania powiązanych części

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }

    if (req.method === "GET") {
      const category = await categoriesCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res
        .status(200)
        .json({ ...category, id: category._id.toHexString() });
    }

    if (req.method === "DELETE") {
      // Przed usunięciem kategorii, usuń powiązane części
      // Zakładamy, że categoryId w częściach to string odpowiadający _id kategorii
      await partsCollection.deleteMany({ categoryId: id });

      const result = await categoriesCollection.deleteOne({
        _id: new ObjectId(id),
      });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.status(204).end(); // No Content
    }

    res.setHeader("Allow", ["GET", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("❌ API handler error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};
