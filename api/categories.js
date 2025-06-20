import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("❌ Missing MONGODB_URI in environment variables")
}

let cachedClient = null
let cachedDb = null

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    },
  })

  await client.connect()
  const db = client.db("Cars")

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export default async function handler(req, res) {
  const { method } = req

  let db
  try {
    const connection = await connectToDatabase()
    db = connection.db
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
    return res.status(500).json({ error: "Database connection failed" })
  }

  const categories = db.collection("categories")

  try {
    if (method === "GET") {
      const data = await categories.find({}).toArray()
      return res.status(200).json(data)
    }

    if (method === "POST") {
      const result = await categories.insertOne(req.body)
      return res.status(201).json({ insertedId: result.insertedId })
    }

    res.setHeader("Allow", ["GET", "POST"])
    return res.status(405).end(`Method ${method} Not Allowed`)
  } catch (error) {
    console.error("❌ Handler error:", error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}
