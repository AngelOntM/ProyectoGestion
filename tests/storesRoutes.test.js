const request = require("supertest");
const app = require("../server");
const Store = require("../models/Store");
const Backup = require("../models/Backup");

// Mock para Store para evitar conexiones reales a la base de datos
jest.mock("../models/Store");
jest.mock("../models/Backup");
jest.mock("../models/Log");

describe("Pruebas para la ruta POST /api/stores", () => {
  it("Debería crear una nueva tienda con datos válidos", async () => {
    const storeData = {
      name: "Tienda ABC",
      address: "Calle Principal 123",
      postal_number: "12345",
      email: "tienda@example.com",
      phone: "1234567890",
    };

    // Simula que no hay tiendas con el mismo nombre o email
    //Store.findOne.mockResolvedValue(null);

    // Simula la creación de la tienda
    //Store.prototype.save = jest.fn().mockResolvedValue(storeData);

    // Realiza la solicitud POST
    const response = await request(app).post("/api/stores").send(storeData);
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

    // Simula que ya existe una tienda con ese nombre o email
    Store.findOne.mockResolvedValue(storeData);
    Store.prototype.save = jest.fn().mockResolvedValue(storeData);

    const response = await request(app).post("/api/stores").send(storeData);
    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty(
      "message",
      "El nombre o email ya existen"
    );
  });
});

describe("Pruebas para la ruta DELETE /api/stores/:name_email", () => {
  it("Debería eliminar una tienda existente por nombre y respaldar antes de eliminarla", async () => {
    const storeData = {
      _id: "123",
      name: "Tienda ABC",
      address: "Calle Principal 123",
      postal_number: "12345",
      email: "tienda@example.com",
      phone: "1234567890",
      toObject: function () {
        return { ...this };
      }, // Simula el método `toObject`
    };

    // Configura los mocks
    Store.findOne.mockResolvedValue(storeData); // Simula que la tienda existe
    //Backup.prototype.save = jest.fn().mockResolvedValue({}); // Simula el respaldo exitoso
    //Store.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 }); // Simula la eliminación exitosa

    // Realiza la solicitud DELETE
    const response = await request(app).delete(`/api/stores/${storeData.name}`);

    // Verifica el estado y la respuesta
    expect(response.status).toBe(202);
    expect(response.body).toHaveProperty("deleted", true);

    // Verifica que se haya llamado al respaldo antes de eliminar
    expect(Backup.prototype.save).toHaveBeenCalled();
    expect(Store.deleteOne).toHaveBeenCalledWith({ _id: storeData._id });
  });

  it("Debería eliminar una tienda existente por email y respaldar antes de eliminarla", async () => {
    const storeData = {
      _id: "123",
      name: "Tienda ABC",
      address: "Calle Principal 123",
      postal_number: "12345",
      email: "tienda@example.com",
      phone: "1234567890",
      toObject: function () {
        return { ...this };
      }, // Simula el método `toObject`
    };

    // Configura los mocks
    Store.findOne.mockResolvedValue(storeData); // Simula que la tienda existe
    Backup.prototype.save = jest.fn().mockResolvedValue({}); // Simula el respaldo exitoso
    Store.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 }); // Simula la eliminación exitosa

    // Realiza la solicitud DELETE
    const response = await request(app).delete(
      `/api/stores/${storeData.email}`
    );

    // Verifica el estado y la respuesta
    expect(response.status).toBe(202);
    expect(response.body).toHaveProperty("deleted", true);

    // Verifica que se haya llamado al respaldo antes de eliminar
    expect(Backup.prototype.save).toHaveBeenCalled();
    expect(Store.deleteOne).toHaveBeenCalledWith({ _id: storeData._id });
  });

  it("Debería retornar un error 404 si la tienda no existe", async () => {
    Store.findOne.mockResolvedValue(null); // Simula que la tienda no existe

    const response = await request(app).delete("/api/stores/NoExistente");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "El nombre o email de la tienda no existe"
    );
  });
});

describe("Pruebas para la ruta GET /api/stores", () => {
  it("Debería devolver todas las tiendas con estado 200", async () => {
    const storeData = [
      {
        _id: "123",
        name: "Tienda ABC",
        address: "Calle Principal 123",
        postal_number: "12345",
        email: "tienda1@example.com",
        phone: "1234567890",
      },
      {
        _id: "124",
        name: "Tienda XYZ",
        address: "Calle Secundaria 456",
        postal_number: "54321",
        email: "tienda2@example.com",
        phone: "0987654321",
      },
    ];

    // Configura el mock para que retorne un array de tiendas
    Store.find.mockResolvedValue(storeData);

    // Realiza la solicitud GET
    const response = await request(app).get("/api/stores");

    // Verifica el estado y la respuesta
    expect(response.status).toBe(200);
    expect(response.body).toEqual(storeData);
    expect(response.body).toHaveLength(2); // Verifica que el número de tiendas sea correcto
  });
});

describe("Pruebas para la ruta PUT /api/stores/:name_email", () => {
  it("Debería modificar una tienda existente", async () => {
    const name_email = "tienda@example.com";
    const storeData = {
      _id: "123",
      name: "Tienda ABC",
      address: "Calle Principal 123",
      postal_number: "12345",
      email: "tienda@example.com",
      phone: "1234567890",
    };

    const updatedStoreData = {
      name: "Tienda Actualizada",
      address: "Calle Actualizada 456",
      postal_number: "67890",
      email: "tienda_actualizada@example.com",
      phone: "0987654321",
    };

    // Simula que la tienda existe y tiene un método toObject
    const storeDocument = {
      ...storeData,
      toObject: jest.fn().mockReturnValue(storeData), // Simula el método toObject
    };

    // Simula que `findOne` devuelve un documento de Mongoose
    Store.findOne.mockResolvedValue(storeDocument);

    // Simula que el backup se guarda correctamente
    Backup.prototype.save.mockResolvedValue();

    // Simula que la tienda se actualiza
    Store.updateOne.mockResolvedValue({ modifiedCount: 1 });

    // Realiza la solicitud PUT
    const response = await request(app)
      .put(`/api/stores/${name_email}`)
      .send(updatedStoreData);

    // Verifica el estado y la respuesta
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ modified: true });

    // Verifica que Store.updateOne haya sido llamado
    expect(Store.updateOne).toHaveBeenCalledWith(
      { _id: storeDocument._id },
      updatedStoreData
    );
  });

  it("Debería retornar un error 404 si la tienda no existe", async () => {
    const name_email = "tienda_inexistente@example.com";
    const updatedStoreData = {
      name: "Tienda Actualizada",
      address: "Calle Actualizada 456",
      postal_number: "67890",
      email: "tienda_actualizada@example.com",
      phone: "0987654321",
    };

    // Simula que la tienda no existe
    Store.findOne.mockResolvedValue(null);

    // Realiza la solicitud PUT
    const response = await request(app)
      .put(`/api/stores/${name_email}`)
      .send(updatedStoreData);

    // Verifica que el estado sea 404 y el mensaje de error sea el esperado
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "El nombre o email de la tienda no existe"
    );
  });

  it("Debería retornar un error 400 si los datos no son válidos", async () => {
    const name_email = "tienda@example.com";
    const invalidStoreData = {
      name: "",
      address: "Calle Actualizada 456",
      postal_number: "67890",
      email: "tienda_actualizada@example.com",
      phone: "0987654321",
    };

    // Simula que la tienda existe
    Store.findOne.mockResolvedValue({ _id: "123" });

    // Realiza la solicitud PUT
    const response = await request(app)
      .put(`/api/stores/${name_email}`)
      .send(invalidStoreData);

    // Verifica que el estado sea 400 y que el error de validación esté en el cuerpo de la respuesta
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
