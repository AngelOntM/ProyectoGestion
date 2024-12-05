const { Builder, Browser, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const TIMEOUT = 5000; // Tiempo máximo para esperar elementos

// Función auxiliar para encontrar y hacer clic en un elemento
async function clickElement(driver, locator, description) {
  try {
    const element = await driver.wait(until.elementLocated(locator), TIMEOUT);
    await driver.wait(until.elementIsVisible(element), TIMEOUT);
    await driver.wait(until.elementIsEnabled(element), TIMEOUT);
    await element.click();
  } catch (error) {
    throw error; // Lanza el error para marcar la prueba como fallida
  }
}

describe("Pruebas de la pagina de Productos", () => {
  let driver;

  // Configuración inicial antes de las pruebas
  beforeAll(async () => {
    try {
      driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(
          new chrome.Options().addArguments(
            "--headless=new",
            "--headless",
            "--no-sandbox",
            "--window-size=1920x1080"
          )
        )
        .build();
      await driver.get("http://host.docker.internal:8080/");
    } catch (error) {
      throw error;
    }
  });

  // Finalización después de las pruebas
  afterAll(async () => {
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

      // Confirmar la eliminación
      const confirmButton = await driver.wait(
        until.elementLocated(By.className("swal2-confirm")),
        TIMEOUT
      );
      await confirmButton.click();
    } catch (error) {
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
  } catch (error) {
    throw error;
  }
}
