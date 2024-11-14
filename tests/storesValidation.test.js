const storesValidation = require("../validation/stores.validation");

describe("Pruebas para la validación de la tienda", () => {
  it("debería validar los datos correctos de la tienda", () => {
    const data = {
      name: "Tienda ABC",
      address: "Calle Principal 123",
      postal_number: "12345",
      email: "tienda@example.com",
      phone: "1234567890",
    };

    const { error } = storesValidation.newStore(data);
    expect(error).toBeUndefined();
  });

  it("debería fallar si falta el nombre", () => {
    const data = {
      address: "Calle Principal 123",
      postal_number: "12345",
      email: "tienda@example.com",
      phone: "1234567890",
    };

    const { error } = storesValidation.newStore(data);
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('"name" is required');
  });

  it("debería fallar si el número postal es inválido", () => {
    const data = {
      name: "Tienda ABC",
      address: "Calle Principal 123",
      postal_number: "1234", // Solo 4 dígitos en lugar de 5
      email: "tienda@example.com",
      phone: "1234567890",
    };

    const { error } = storesValidation.newStore(data);
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain(
      "fails to match the required pattern"
    );
  });

  it("debería fallar si el formato del email es incorrecto", () => {
    const data = {
      name: "Tienda ABC",
      address: "Calle Principal 123",
      postal_number: "12345",
      email: "tienda-at-example.com", // Formato inválido
      phone: "1234567890",
    };

    const { error } = storesValidation.newStore(data);
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain("must be a valid email");
  });

  it("debería fallar si el teléfono no tiene 10 dígitos", () => {
    const data = {
      name: "Tienda ABC",
      address: "Calle Principal 123",
      postal_number: "12345",
      email: "tienda@example.com",
      phone: "12345", // Solo 5 dígitos en lugar de 10
    };

    const { error } = storesValidation.newStore(data);
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain(
      "fails to match the required pattern"
    );
  });
});
