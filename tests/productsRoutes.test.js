const request = require("supertest");
const app = require("../app.js");
const Product = require("../models/Product.js");
const mongoose = require("mongoose");

// Datos de prueba iniciales
const initialProducts = [
  {
    name: "Producto 1",
    price: 10.99,
    description: "Descripción del producto 1",
    sku: "SKU001",
    quantity: 10,
  },
  {
    name: "Producto 2",
    price: 20.99,
    description: "Descripción del producto 2",
    sku: "SKU002",
    quantity: 20,
  },
];

// Nuevo producto para pruebas
const newProduct = {
  name: "Producto Nuevo",
  price: 15.5,
  description: "Descripción del producto nuevo",
  sku: "SKU003",
  quantity: 15,
};

const productSet = async () => {
  await Product.insertMany(initialProducts);
};

const productDelete = async () => {
  await Product.deleteMany({});
};

afterEach(async () => {
  productDelete();
});

describe("POST /api/products", () => {
  it("Debería crear un nuevo producto con datos válidos", async () => {
    const response = await request(app).post("/api/products").send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("created", true);
    expect(response.body.store.name).toBe(newProduct.name);
  });

  it("Debería retornar un error 400 si los datos son inválidos", async () => {
    const invalidProduct = {
      name: "Pr", // Nombre muy corto
      price: -10, // Precio inválido
      description: "Descripción inválida",
      sku: "", // SKU vacío
    };

    const response = await request(app)
      .post("/api/products")
      .send(invalidProduct);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("Debería retornar un error 409 si el nombre o SKU ya existen", async () => {
    await request(app).post("/api/products").send(initialProducts[0]);
    const response = await request(app)
      .post("/api/products")
      .send(initialProducts[0]);
    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty(
      "message",
      "El nombre o sku ya existen"
    );
  });
});

describe("DELETE /api/products/:id", () => {
  it("Debería eliminar un producto existente", async () => {
    const response1 = await request(app).post("/api/products").send(newProduct);
    const response = await request(app).delete(
      `/api/products/${response1.body.store._id}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("deleted", true);
  });

  it("Debería retornar un error 404 si el producto no existe", async () => {
    const response = await request(app).delete(
      "/api/products/64e577af4e2b9263548473dc"
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "El producto con el ID especificado no existe"
    );
  });

  it("Debería retornar un error 400 si el ID es inválido", async () => {
    const response = await request(app).delete("/api/products/123");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "El ID proporcionado no es válido"
    );
  });
});

describe("GET /api/products", () => {
  it("Debería devolver todos los productos con estado 200", async () => {
    await productSet();
    const response = await request(app).get("/api/products");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(initialProducts.length);
  });
});

describe("PUT /api/products/:id", () => {
  it("Debería actualizar un producto existente", async () => {
    const response1 = await request(app).post("/api/products").send(newProduct);
    const response = await request(app)
      .put(`/api/products/${response1.body.store._id}`)
      .send(newProduct);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("modified", true);
  });

  it("Debería retornar un error 404 si el producto no existe", async () => {
    const response = await request(app)
      .put("/api/products/64e577af4e2b9263548473dc")
      .send(newProduct);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "El producto con el ID especificado no existe"
    );
  });

  it("Debería retornar un error 400 si los datos son inválidos", async () => {
    const invalidData = {
      name: "Pr", // Nombre muy corto
      price: -10, // Precio inválido
      description: "Descripción inválida",
      sku: "", // SKU vacío
    };

    const response1 = await request(app).post("/api/products").send(newProduct);
    const response = await request(app)
      .put(`/api/products/${response1.body.store._id}`)
      .send(invalidData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
