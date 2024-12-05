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

describe("Pruebas de la pagina de Tiendas", () => {
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

  it("Debería navegar hacia la página de tiendas", async () => {
    await clickElement(driver, By.id("btn-stores"), "Botón Tiendas");
  });

  it("Debería abrir el modal para agregar una nueva tienda", async () => {
    await clickElement(
      driver,
      By.id("btn-createStore"),
      "Botón Agregar Tienda"
    );
  });

  it("Debería rellenar los campos del formulario", async () => {
    // Generar datos aleatorios para el formulario
    const storeData = {
      name: `Tienda ${Math.floor(Math.random() * 1000)}`,
      address: `Dirección ${Math.floor(Math.random() * 1000)}`,
      postalCode: `${Math.floor(10000 + Math.random() * 90000)}`, // 5 dígitos
      email: `tienda${Math.floor(Math.random() * 1000)}@gmail.com`,
      phone: `${Math.floor(1000000000 + Math.random() * 9000000000)}`, // 10 dígitos
    };

    // Esperar a que el modal esté visible
    const modal = await driver.wait(
      until.elementLocated(By.id("createStoreModal")),
      TIMEOUT
    );
    await driver.wait(until.elementIsVisible(modal), TIMEOUT);

    // Rellenar los campos del formulario
    await fillInputField(
      driver,
      By.id("name"),
      storeData.name,
      "Nombre de la Tienda"
    );
    await fillInputField(
      driver,
      By.id("address"),
      storeData.address,
      "Dirección"
    );
    await fillInputField(
      driver,
      By.id("postal_number"),
      storeData.postalCode,
      "Código Postal"
    );
    await fillInputField(
      driver,
      By.id("email"),
      storeData.email,
      "Correo Electrónico"
    );
    await fillInputField(driver, By.id("phone"), storeData.phone, "Teléfono");
  });

  it("Debería enviar el formulario de creación de tienda", async () => {
    const submitButton = await driver.wait(
      until.elementLocated(By.id("btn-submitCreateStore")),
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
