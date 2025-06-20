const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ Missing MongoDB connection string in MONGODB_URI");
  throw new Error("MONGODB_URI not set");
}

let cachedClient = null;

module.exports = async (req, res) => {
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

  const db = cachedClient.db("Cars");
  const matches = db.collection("categories");

  try {
    if (req.method === "POST") {
      const result = await matches.insertOne(req.body);
      return res.status(201).json({ insertedId: result.insertedId });
    }

    if (req.method === "GET") {
      const data = await matches.find({}).toArray();
      return res.status(200).json(data);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("❌ API handler error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
