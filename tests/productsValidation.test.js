const { newProduct } = require("../validation/products.validation");

describe("newProduct Validator", () => {
  it("debería validar correctamente un producto válido", () => {
    const validProduct = {
      name: "Producto válido",
      price: 99.99,
      description: "Descripción opcional de un producto válido",
      sku: "PROD123",
      quantity: 10,
    };

    const { error, value } = newProduct(validProduct);
    expect(error).toBeUndefined();
    expect(value).toEqual(validProduct);
  });

  it("debería fallar si falta el nombre", () => {
    const invalidProduct = {
      price: 99.99,
      description: "Descripción opcional",
      sku: "PROD123",
      quantity: 10,
    };

    const { error } = newProduct(invalidProduct);
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/"name" is required/);
  });

  it("debería fallar si el precio es negativo", () => {
    const invalidProduct = {
      name: "Producto inválido",
      price: -10,
      description: "Descripción opcional",
      sku: "PROD123",
      quantity: 10,
    };

    const { error } = newProduct(invalidProduct);
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(
      /"price" must be a positive number/
    );
  });

  it("debería fallar si el SKU tiene caracteres no alfanuméricos", () => {
    const invalidProduct = {
      name: "Producto inválido",
      price: 10.5,
      description: "Descripción opcional",
      sku: "SKU#123",
      quantity: 5,
    };

    const { error } = newProduct(invalidProduct);
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(
      /"sku" must only contain alpha-numeric characters/
    );
  });

  it("debería fallar si la cantidad es negativa", () => {
    const invalidProduct = {
      name: "Producto inválido",
      price: 10.5,
      description: "Descripción opcional",
      sku: "PROD123",
      quantity: -5,
    };

    const { error } = newProduct(invalidProduct);
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(
      /"quantity" must be greater than or equal to 0/
    );
  });

  it("debería aceptar un producto sin descripción", () => {
    const validProduct = {
      name: "Producto sin descripción",
      price: 50.25,
      sku: "SKU456",
      quantity: 20,
    };

    const { error, value } = newProduct(validProduct);
    expect(error).toBeUndefined();
    expect(value).toEqual(validProduct);
  });

  it("debería fallar si el nombre es demasiado corto", () => {
    const invalidProduct = {
      name: "Pr",
      price: 50.25,
      sku: "SKU456",
      quantity: 20,
    };

    const { error } = newProduct(invalidProduct);
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(
      /"name" length must be at least 3 characters long/
    );
  });
});
