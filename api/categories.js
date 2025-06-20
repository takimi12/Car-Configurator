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
    const categoriesCollection = db.collection("categories");

    if (req.method === "GET") {
      const categories = await categoriesCollection.find({}).toArray();
      return res
        .status(200)
        .json(categories.map((cat) => ({ ...cat, id: cat._id.toHexString() })));
    }

    if (req.method === "POST") {
      const newCategory = req.body;
      const result = await categoriesCollection.insertOne(newCategory);
      const createdCategory = {
        ...newCategory,
        id: result.insertedId.toHexString(),
      };
      return res.status(201).json(createdCategory);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("❌ API handler error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};
