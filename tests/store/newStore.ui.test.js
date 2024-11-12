const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const chrome = require("selenium-webdriver/chrome");
const edge = require("selenium-webdriver/edge");
const {expect} = require('chai');

const nuevaTienda = {
    "nombre": "Mi Tienda :3",
    "descripcion": "Tienda ABC",
    "rfc": "TIEN123456X12",
    "clave": "A123"
};

async function sleep(time) {
    return new Promise((resolve, reject) =>{
        setTimeout(() => {
            resolve(true);
        }, time);
    })
}

async function esperarLoader(driver) {
    let loaderVisible = true;
    while(loaderVisible) {
        try {
            await driver.findElement(By.xpath("//div[contains(@class,'loader')]"));
        } catch(error) {
            loaderVisible = false;
        }
    }
}

async function createDriver(isChrome) {
    let driver;
    
    if(isChrome) {
        driver = await new Builder().forBrowser(Browser.CHROME)
            .setChromeOptions(new chrome.Options().addArguments('--headless=new', '--headless', '--no-sandbox', '--window-size=1920x1080'))
            .build();
    } else {
        driver = await new Builder().forBrowser(Browser.EDGE)
            .setEdgeOptions(new edge.Options().addArguments('--headless=new', '--headless', '--no-sandbox', '--window-size=1920x1080'))
            .build();
    }
    await driver.get("http://localhost:2024/adminTiendas");
    return driver;
}

describe('Endpoint de tiendas', async function() {

    let driver;
    before(async function() {
        driver = await createDriver(true);
        //Interactuar con el sitio web
    });
    
    it('Se crea una tienda y luego se elimina en la UI', async function() {
        await esperarLoader(driver);
        const nombre = await driver.findElement(By.id("nombre"));
        const descripcion = await driver.findElement(By.id("descripcion"));
        const clave = await driver.findElement(By.id("clave"));
        const rfc = await driver.findElement(By.id("rfc"));

        await nombre.sendKeys(nuevaTienda.nombre);
        await descripcion.sendKeys(nuevaTienda.descripcion);
        await clave.sendKeys(nuevaTienda.clave);
        await rfc.sendKeys(nuevaTienda.rfc);

        const crear = await driver.findElement(By.xpath("//button[@type='submit']"));
        await crear.click();
        await esperarLoader(driver);

        const mensaje = await driver.findElement(By.xpath("//div[@role='alert']"));
        let textoMensaje = await mensaje.getText();
        expect(textoMensaje).to.equal("Se creó la tienda :D");

        const tiendas = await driver.findElements(By.tagName("li"));
        const nombreTienda = `${nuevaTienda.nombre} (${nuevaTienda.rfc} - ${nuevaTienda.clave})`;

        for (let i = 0; i < tiendas.length; i++) {
            const tienda = tiendas[i];
            let textoTienda = await tienda.getText();
            textoTienda = textoTienda.replace('delete\n', '');

            if(textoTienda === nombreTienda) {
                const eliminar = await tienda.findElement(By.xpath("//span"));
                await eliminar.click();
                await esperarLoader(driver);
                break;
            }
        }

        textoMensaje = await mensaje.getText();
        expect(textoMensaje).to.equal("Se eliminó la tienda :D");

    });

    after(async function() {
        await driver.quit();
    });
});
