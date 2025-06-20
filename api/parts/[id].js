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
    const { id } = req.query;
    const partsCollection = db.collection("parts");

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Part ID" });
    }

    if (req.method === "DELETE") {
      const result = await partsCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Part not found" });
      }
      return res.status(204).end();
    }

    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("❌ API handler error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};
