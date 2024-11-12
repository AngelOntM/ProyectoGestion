const constants = require('../../utils/constants');

let entorno = 'dev';
const SERVICE_URL = constants.URLS[entorno];

test('Se valida que una tienda se cree en el endpoint', async function() {
    const tienda = {
        "nombre": "Mi Primera Tienda :3",
        "descripcion": "Tienda ABC",
        "rfc": "TIEN123456X12",
        "clave": "A123"
    }

    let created;
    let response = await fetch(`${SERVICE_URL}/stores/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tienda)
    });
    let responseBody = await response.json();
    created = responseBody.created;

    expect(created).toBe(true);

    let deleted;
    response = await fetch(`${SERVICE_URL}/stores/${tienda.clave}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });
    responseBody = await response.json();
    deleted = responseBody.deleted;
    
    expect(deleted).toBe(true);
});

test('Se valida que una tienda NO se puede duplicar', async function() {
    const tienda = {
        "nombre": "Mi Primera Tienda :3",
        "descripcion": "Tienda ABC",
        "rfc": "TIEN123456X12",
        "clave": "A123"
    }

    let created;
    let response = await fetch(`${SERVICE_URL}/stores/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tienda)
    });
    let responseBody = await response.json();
    created = responseBody.created;
    
    expect(response.status).toBe(200);
    expect(created).toBe(true);

    response = await fetch(`${SERVICE_URL}/stores/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tienda)
    });
    
    expect(response.status).toBe(409);

    let deleted;
    response = await fetch(`${SERVICE_URL}/stores/${tienda.clave}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });
    responseBody = await response.json();
    deleted = responseBody.deleted;

    expect(deleted).toBe(true);
});