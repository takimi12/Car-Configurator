import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Twój connection string do MongoDB Atlas
const client = new MongoClient(
  "mongodb+srv://tomek12olech:7MytflC2STM5Wroe@cluster.etrcyrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster",
);
const dbName = "Cars";

app.use(cors());
app.use(express.json());

/** === CATEGORY ROUTES === **/

// POST new category
app.post("/categories", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const categories = db.collection("categories");

    const result = await categories.insertOne(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error("Insert category error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

// GET all categories
app.get("/categories", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const categories = db.collection("categories");

    const allCategories = await categories.find({}).toArray();
    res.json(allCategories);
  } catch (error) {
    console.error("Fetch categories error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

// DELETE a category by ID
app.delete("/categories/:id", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const categories = db.collection("categories");
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Category ID" });
    }

    const result = await categories.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

/** === PART ROUTES === **/

// GET all parts
app.get("/parts", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const parts = db.collection("parts");

    const allParts = await parts.find({}).toArray();
    res.json(allParts);
  } catch (error) {
    console.error("Fetch parts error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

// GET a single part by ID
app.get("/parts/:id", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const parts = db.collection("parts");
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Part ID" });
    }

    const part = await parts.findOne({ _id: new ObjectId(id) });

    if (!part) {
      return res.status(404).json({ error: "Part not found" });
    }

    res.json(part);
  } catch (error) {
    console.error("Fetch part by ID error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

// ✅ POST a new part
app.post("/parts", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const parts = db.collection("parts");

    const { name, price, partId, categoryId } = req.body;

    if (!name || !price || !partId || !categoryId) {
      return res.status(400).json({ error: "Brak wymaganych pól" });
    }

    const result = await parts.insertOne({
      name,
      price,
      partId,
      categoryId,
      createdAt: new Date(),
    });

    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error("Insert part error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});
app.delete("/parts/:id", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const parts = db.collection("parts");
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Part ID" });
    }

    const result = await parts.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Part not found" });
    }

    res.status(200).json({ message: "Part deleted successfully" });
  } catch (error) {
    console.error("Delete part error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});
/** === ORDER ROUTES === **/

// POST a new order
app.post("/orders", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const orders = db.collection("orders");

    const result = await orders.insertOne(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error("Insert order error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

// GET all orders
app.get("/orders", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const orders = db.collection("orders");

    const allOrders = await orders.find({}).toArray();
    res.json(allOrders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

/** === SERVER START === **/

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
