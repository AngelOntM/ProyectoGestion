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

describe("Pruebas de la pagina de Tiendas", () => {
  let driver;

  // Configuración inicial antes de las pruebas
  beforeAll(async () => {
    driver = await new Builder().forBrowser("MicrosoftEdge").build();
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
    console.log("✅ Modal visible.");

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
    console.log("✅ Formulario enviado.");
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
