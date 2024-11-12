const constants = require("./constants");

module.exports = {
    processArguments: function() {
        let arguments = process.argv;
        let entorno = constants.ENVIRONMENTS.production;
        arguments.forEach(arg => {
            let argumento = arg.toLowerCase();
            if(argumento.startsWith("--entorno=")) {
                let valor = argumento.replace("--entorno=", '');
                entorno = constants.ENVIRONMENTS[valor] || 
                        constants.ENVIRONMENTS.production;
            }
        });

        return entorno;
    }
}