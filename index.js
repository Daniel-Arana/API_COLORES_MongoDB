 require("dotenv").config();

const express = require("express");
const {json} = require("body-parser");
const cors = require("cors");
const {leerColores,crearColor,borrarColor} = require("./db"); //requerimos las funciones llamadas de la BBDD

const servidor = express();

servidor.use(cors());

servidor.use(json()); //cualquier cosa que venga con json será interceptada

servidor.use("/mentirillas", express.static("./pruebas"));
//si escribo /mentirillas, pasa,devuelve, ./pruebas

servidor.get("/colores", async (peticion, respuesta) => {
    try{
        let colores = await leerColores();

        colores = colores.map(({_id,r,g,b}) => { return {id: _id,r,g,b} });

        respuesta.json(colores);
    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
    
});

servidor.post("/colores/nuevo", async (peticion, respuesta, siguiente) => {
    
    let {r,g,b} = peticion.body; //estas variables saldrán de peticion.body

    let valido = true; //variable en la que asumimos que todo está bien

    [r,g,b].forEach( n => valido = valido && n >= 0 && n <= 255);

    if(valido){ //si todo es valido...

        try{

            let resultado = await crearColor({r,g,b});

            return respuesta.json(resultado);

        }catch(error){
            respuesta.status(500);

            respuesta.json(error);
        }
    }

    siguiente({ error: "faltan parámetros" });//invocamos siguiente()

});

servidor.delete("/colores/borrar/:id([a-f0-9]{24})", async (peticion, respuesta) => {
    try{
        
        let cantidad = await borrarColor(peticion.params.id);

        respuesta.json({ resultado : cantidad > 0 ? "OK" : "KO" });

    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({ error : "error en la petición" });
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error: "recurso no encontrado" });
})

servidor.listen(process.env.PORT);