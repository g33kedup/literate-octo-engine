const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory store
const items = new Map();
let nextId = 1;

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", items: items.size });
});

// List all
app.get("/items", (req, res) => {
  res.json([...items.values()]);
});

// Get one
app.get("/items/:id", (req, res) => {
  const item = items.get(Number(req.params.id));
  if (!item) return res.status(404).json({ error: "not found" });
  res.json(item);
});

// Create
app.post("/items", (req, res) => {
  const item = { id: nextId++, name: req.body.name || "untitled", createdAt: new Date().toISOString() };
  items.set(item.id, item);
  res.status(201).json(item);
});

// Update
app.put("/items/:id", (req, res) => {
  const item = items.get(Number(req.params.id));
  if (!item) return res.status(404).json({ error: "not found" });
  item.name = req.body.name || item.name;
  res.json(item);
});

// Seed
app.post("/seed", (req, res) => {
  items.clear();
  nextId = 1;
  const defaults = ["Laptop", "Keyboard", "Monitor", "Mouse", "Headphones"];
  for (const name of defaults) {
    const item = { id: nextId++, name, createdAt: new Date().toISOString() };
    items.set(item.id, item);
  }
  res.status(201).json([...items.values()]);
});

// Delete
app.delete("/items/:id", (req, res) => {
  if (!items.delete(Number(req.params.id))) return res.status(404).json({ error: "not found" });
  res.status(204).end();
});

app.listen(PORT, () => console.log(`CRUD API running on port ${PORT}`));
