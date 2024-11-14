// helpers.js
const { ENVIRONMENTS } = require("./constants");

module.exports = {
  processArguments: function () {
    const entornoArg = process.argv.find((arg) =>
      arg.toLowerCase().startsWith("--entorno=")
    );

    const entorno = entornoArg
      ? entornoArg.split("=")[1].toLowerCase()
      : ENVIRONMENTS.production;

    return ENVIRONMENTS[entorno] || ENVIRONMENTS.production;
  },
};
