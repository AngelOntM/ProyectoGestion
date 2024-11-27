const { config, ENV } = require("./config");

const app = require("./app"); // Crear la instancia de la app Express

// Iniciar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en ${config.baseUrl}:${PORT} (Entorno: ${ENV})`
  );
});

// Exportar la aplicación y la función para iniciar el servidor
module.exports = app;
