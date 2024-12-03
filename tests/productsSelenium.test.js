const { Builder, By, until } = require("selenium-webdriver");

const TIMEOUT = 5000; // Tiempo máximo para esperar elementos

// Función auxiliar para encontrar y hacer clic en un elemento
async function clickElement(driver, locator, description) {
  try {
    const element = await driver.wait(until.elementLocated(locator), TIMEOUT);
    await driver.wait(until.elementIsVisible(element), TIMEOUT);
    await driver.wait(until.elementIsEnabled(element), TIMEOUT);
    await element.click();
    console.log(`✅ Se hizo clic en: ${description}`);
  } catch (error) {
    console.error(`❌ Error al interactuar con: ${description}`, error);
    throw error; // Lanza el error para marcar la prueba como fallida
  }
}

describe("Pruebas de la pagina de Productos", () => {
  let driver;

  // Configuración inicial antes de las pruebas
  beforeAll(async () => {
    driver = await new Builder().forBrowser("MicrosoftEdge").build();
    await driver.manage().window().maximize(); // Maximiza la ventana del navegador
    await driver.get("http://localhost:8080/");
    console.log("🚀 Navegador inicializado y página cargada.");
  });

  // Finalización después de las pruebas
  afterAll(async () => {
    console.log("🛑 Navegador cerrado.");

    // Esperar 5 segundos para cerrar el navegador
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await driver.quit();
  });

  it("Debería navegar hacia la página de productos", async () => {
    await clickElement(driver, By.id("btn-products"), "Botón Productos");
  });

  it("Debería abrir el modal para agregar una nueva tienda", async () => {
    await clickElement(
      driver,
      By.id("btn-createProduct"),
      "Botón Agregar Producto"
    );
  });

  it("Debería rellenar los campos del formulario", async () => {
    // Generar datos aleatorios para el formulario
    const productData = {
      name: `Producto ${Math.floor(Math.random() * 1000)}`,
      sku: `${Math.floor(10000 + Math.random() * 90000)}`, // 5 dígitos
      description: `Descripción ${Math.floor(Math.random() * 1000)}`,
      price: `${Math.floor(Math.random() * 1000) + 1}`, // 1 a 3 dígitos
      quantity: `${Math.floor(Math.random() * 1000) + 1}`, // 1 a 3 dígitos
    };

    // Esperar a que el modal esté visible
    const modal = await driver.wait(
      until.elementLocated(By.id("createProductModal")),
      TIMEOUT
    );
    await driver.wait(until.elementIsVisible(modal), TIMEOUT);
    console.log("✅ Modal visible.");

    // Rellenar los campos del formulario
    await fillInputField(
      driver,
      By.id("productName"),
      productData.name,
      "Nombre de la Tienda"
    );
    await fillInputField(driver, By.id("productSku"), productData.sku, "SKU");
    await fillInputField(
      driver,
      By.id("productDescription"),
      productData.description,
      "Descripción"
    );
    await fillInputField(
      driver,
      By.id("productPrice"),
      productData.price,
      "Precio"
    );
    await fillInputField(
      driver,
      By.id("productQuantity"),
      productData.quantity,
      "Cantidad"
    );
  });

  it("Debería enviar el formulario de creación de tienda", async () => {
    const submitButton = await driver.wait(
      until.elementLocated(By.id("btn-submitCreateProduct")),
      TIMEOUT
    );
    await driver.wait(until.elementIsVisible(submitButton), TIMEOUT);
    await driver.wait(until.elementIsEnabled(submitButton), TIMEOUT);
    await submitButton.click();
    console.log("✅ Formulario enviado.");
  });

  it("Debería eliminar una tienda de la lista, si no existe ninguna, no hacer nada", async () => {
    try {
      // Localizar el botón de eliminar
      const deleteButton = await driver.wait(
        until.elementLocated(By.className("delete-btn")),
        TIMEOUT
      );

      await driver.wait(until.elementIsVisible(deleteButton), TIMEOUT);
      await driver.wait(until.elementIsEnabled(deleteButton), TIMEOUT);

      // Asegurar que no haya overlays activos
      await driver.wait(
        async () => {
          const overlays = await driver.findElements(
            By.className("swal2-backdrop-show")
          );
          return overlays.length === 0;
        },
        TIMEOUT,
        "Overlay todavía visible"
      );

      await deleteButton.click();
      console.log("✅ Se hizo clic en el botón de eliminar.");

      // Confirmar la eliminación
      const confirmButton = await driver.wait(
        until.elementLocated(By.className("swal2-confirm")),
        TIMEOUT
      );
      await confirmButton.click();
      console.log("✅ Confirmación enviada.");
    } catch (error) {
      console.error("❌ Error al intentar eliminar una tienda.", error);
      throw error;
    }
  });
});

async function fillInputField(driver, locator, value, description) {
  try {
    const inputField = await driver.wait(
      until.elementLocated(locator),
      TIMEOUT
    );
    await driver.wait(until.elementIsVisible(inputField), TIMEOUT);
    await driver.wait(until.elementIsEnabled(inputField), TIMEOUT);
    await inputField.clear(); // Limpiar el campo antes de enviar datos
    await inputField.sendKeys(value);
    console.log(`✅ Campo rellenado: ${description}`);
  } catch (error) {
    console.error(`❌ Error al rellenar el campo: ${description}`, error);
    throw error;
  }
}
