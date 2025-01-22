const express = require("express");
const { dbConnection } = require("./db/config");
const cors = require("cors");

require("dotenv").config();

//crear el servirdor de express
const app = express();

//DB
dbConnection();

app.use(cors());

//Directorio Publico
app.use(express.static("public"));

//Lectura y parseo del body
app.use(express.json());

//routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

//escuchar peticion
app.listen(process.env.PORT, () => {
  console.log(`Sevidor corriendo en el puerto ${process.env.PORT}`);
});
