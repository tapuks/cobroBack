const express = require("express");
const products = require("./products.json");

const crypto = require("node:crypto");
const z = require("zod");
const cors = require("cors");
const { validateProduct, validatePartialProduct } = require("./products");

const app = express();
app.use(express.json()); // Middleware para parsear JSON
app.use(cors()); // Middleware para habilitar CORS
app.disable("x-powered-by"); // desabilita o header X-Powered-By

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/products", (req, res) => {
  const { category } = req.query;
  if (category) {
    const filteredProducts = products.filter(
      (product) =>
        product.category.toLocaleLowerCase() === category.toLocaleLowerCase()
    );
    return res.json(filteredProducts);
  }

  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const productId = products.find((product) => product.id === parseInt(id));

  if (productId) {
    return res.json(productId);
  }
  res.status(404).json({ error: "Product not found" });
});

app.post("/products", (req, res) => {
  const validate = validateProduct(req.body);
  if (!validate.success) {
    return res.status(400).json({ error: validate.error });
  }

  // En base de datos
  const newProduct = {
    id: crypto.randomUUID(),
    ...validate.data,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.patch("/products/:id", (req, res) => {
  const validate = validatePartialProduct(req.body);
  if (!validate.success) {
    return res.status(400).json({ error: validate.error });
  }

  const { id } = req.params;
  const productIndex = products.findIndex((product) => product.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const updateProduct = { ...products[productIndex], ...validate.data };
  products[productIndex] = updateProduct;
  return res.json(updateProduct);
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex((product) => product.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  products.splice(productIndex, 1);
  return res.json({ message: "Producto eliminado" });
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});