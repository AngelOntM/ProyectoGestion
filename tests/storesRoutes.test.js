const request = require("supertest");
const app = require("../app.js");
const Store = require("../models/Store.js");

//Datos de de prueba antes de cada test
const initialData = [
  {
    name: "Tienda 1",
    address: "Calle Principal 123",
    postal_number: "12345",
    email: "ajoman@gmail.com",
    phone: "1234567890",
  },
  {
    name: "Tienda 2",
    address: "Calle Secundaria 456",
    postal_number: "54321",
    email: "postal@gmail.com",
    phone: "0987654321",
  },
];

const testData = {
  name: "Tienda 3",
  address: "Calle Tercera 789",
  postal_number: "67890",
  email: "email3@gmail.com",
  phone: "5432167890",
};

const storeSet = async () => {
  await Store.insertMany(initialData);
};

const storeDelete = async () => {
  await Store.deleteMany({});
};

beforeEach(async () => {
  storeDelete().then(() => {
    storeSet();
  });
});

afterAll(async () => {
  storeDelete();
});

describe("POST /api/stores", () => {
  it("Debería crear una nueva tienda con datos válidos", async () => {
    const response = await request(app).post("/api/stores").send(testData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("created", true);
  });

  it("Debería retornar un error 400 si los datos de la tienda son inválidos", async () => {
    const invalidStoreData = {
      name: "AB", // Nombre muy corto
      address: "Calle Principal",
      postal_number: "123", // Número postal inválido
      email: "no-un-email", // Email no válido
      phone: "12345", // Teléfono muy corto
    };

    const response = await request(app)
      .post("/api/stores")
      .send(invalidStoreData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("Debería retornar un error 409 si el nombre o email ya existen", async () => {
    const storeData = {
      name: "Tienda Existente",
      address: "Calle Principal 123",
      postal_number: "12345",
      email: "existe@example.com",
      phone: "1234567890",
    };

    await request(app).post("/api/stores").send(storeData);
    const response = await request(app).post("/api/stores").send(storeData);
    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty(
      "message",
      "El nombre o email ya existen"
    );
  });
});

describe("DELETE /api/stores/:name_email", () => {
  it("Debería eliminar una tienda existente por nombre y respaldar antes de eliminarla", async () => {
    const response1 = await request(app).get("/api/stores").send();
    const response = await request(app).delete(
      `/api/stores/${response1.body[0]._id}`
    );

    // Verifica el estado y la respuesta
    expect(response.status).toBe(202);
    expect(response.body).toHaveProperty("deleted", true);
  });

  it("Debería retornar un error 404 si la tienda no existe", async () => {
    const response = await request(app).delete(
      "/api/stores/674577af4e2b9263548473dc"
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "La tienda con el ID especificado no existe"
    );
  });
});

describe("GET /api/stores", () => {
  it("Debería devolver todas las tiendas con estado 200", async () => {
    const response = await request(app).get("/api/stores").send();

    // Verifica el estado y la respuesta
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(initialData.length); // Verifica que el número de tiendas sea correcto
  });
});

describe("PUT /api/stores/:name_email", () => {
  it("Debería modificar una tienda existente", async () => {
    updatedStoreData = {
      name: "Tienda Actualizada",
      address: "Calle Actualizada 456",
      postal_number: "67890",
      email: "email@prueba.com",
      phone: "0987654321",
    };

    const response1 = await request(app).get("/api/stores").send();
    const response = await request(app)
      .put(`/api/stores/${response1.body[0]._id}`)
      .send(updatedStoreData);

    // Verifica el estado y la respuesta
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ modified: true });
  });

  it("Debería retornar un error 404 si la tienda no existe", async () => {
    updatedStoreData = {
      name: "Tienda Actualizada",
      address: "Calle Actualizada 456",
      postal_number: "67890",
      email: "email@prueba.com",
      phone: "0987654321",
    };

    // Realiza la solicitud PUT
    const response = await request(app)
      .put("/api/stores/674577af4e2b9263548473dc")
      .send(updatedStoreData);

    // Verifica que el estado sea 404 y el mensaje de error sea el esperado
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "La tienda con el ID especificado no existe"
    );
  });

  it("Debería retornar un error 400 si los datos no son válidos", async () => {
    const invalidStoreData = {
      name: "AB", // Nombre muy corto
      address: "Calle Principal",
      postal_number: "123", // Número postal inválido
      email: "no-un-email", // Email no válido
      phone: "12345", // Teléfono muy corto
    };

    const response1 = await request(app).get("/api/stores").send();

    // Realiza la solicitud PUT
    const response = await request(app)
      .put(`/api/stores/${response1.body[0]._id}`)
      .send(invalidStoreData);

    // Verifica que el estado sea 400 y que el error de validación esté en el cuerpo de la respuesta
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
