require("dotenv").config();

const express = require("express");

const servidor = express();

servidor.get("/colores", (peticion, respuesta) => {
    respuesta.send("..get");
});

servidor.post("/colores/nuevo", (peticion, respuesta) => {
    respuesta.send("..post");
});

servidor.delete("/colores/borrar/:id", (peticion, respuesta) => {
    respuesta.send("..delete");
});

servidor.listen(process.env.PORT);