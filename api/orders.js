// @ts-ignore
const { MongoClient, ObjectId } = require("mongodb");

// @ts-ignore
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ Missing MONGODB_URI");
  throw new Error("MONGODB_URI not set");
}

let cachedClient = null;

// @ts-ignore
module.exports = async (req, res) => {
  if (!cachedClient) {
    try {
      const client = new MongoClient(uri, {
        serverApi: { version: "1", strict: true, deprecationErrors: true },
      });
      await client.connect();
      cachedClient = client;
    } catch (err) {
      console.error("❌ MongoDB connection error:", err);
      return res.status(500).json({ error: "DB connection failed" });
    }
  }

  const db = cachedClient.db("yourDatabaseName");
  const categories = db.collection("categories");

  try {
    if (req.method === "GET") {
      const data = await categories.find({}).toArray();
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const result = await categories.insertOne(req.body);
      return res.status(201).json({ insertedId: result.insertedId });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      const result = await categories.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ deletedCount: result.deletedCount });
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("❌ API handler error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
