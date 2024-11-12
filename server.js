const constants = require("./utils/constants");
const helpers = require("./utils/helpers");
let entorno = helpers.processArguments();

const express = require("express");
const mongoose = require("mongoose");
const expressip = require("express-ip");
const app = express();
app.use(expressip().getIpInfoMiddleware);
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const config = require("./config.json");

const storesRouter = require("./routers/store");
const Log = require("./models/Log");

//http:localhost:2024/stores/new
app.use("/stores", storesRouter);

app.use("/logs", async (req, res) => {
  const logs = await Log.find({});
  res.send(logs);
});

const PORT = config.mongo[entorno].port;
app.listen(PORT, function (error) {
  if (error) {
    console.error(error);
    process.exit(0);
  }

  console.log(`Conectado al puerto: ${PORT}`);
  let params = "";
  if (config.mongo[entorno].params) {
    params = config.mongo[entorno].params;
  }

  const mongoURI = `${config.mongo[entorno].host}/${config.mongo[entorno].defaultDB}${params}`;
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log(`Conectado al mongo: ${mongoURI}`);
    })
    .catch((error) => {
      console.error(error);
      process.exit(0);
    });
});
