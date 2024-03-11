require("dotenv").config();

const {MongoClient,ObjectId} = require("mongodb");

function conectar(){
    return MongoClient.connect(process.env.URL_DB);
}

function leerColores(){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let coleccion = conexion.db("colores").collection("colores");

            let colores =  await coleccion.find({}).toArray(); //toArray es para convertir lo que se solicite con el find() en un array

            conexion.close();

            ok(colores);

        }catch (error){

            ko({error : "error en base de datos"});

        }
    });

}


function crearColor(color){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let coleccion = conexion.db("colores").collection("colores");

            let {insertedId} =  await coleccion.insertOne(color); //toArray es para convertir lo que se solicite con el find() en un array

            conexion.close();

            ok({id : insertedId });

        }catch (error){

            ko({error : "error en base de datos"});

        }
    });

}


function borrarColor(id){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let coleccion = conexion.db("colores").collection("colores");

            let {deletedCount} =  await coleccion.deleteOne({ _id : new ObjectId(id) }); //toArray es para convertir lo que se solicite con el find() en un array

            conexion.close();

            ok(deletedCount);

        }catch (error){

            ko({error : "error en base de datos"});

        }
    });

}

module.exports = {leerColores, crearColor, borrarColor};

//borrarColor('65eef2e1c576c06ec29bafce') //esto es para hacer una prueba de borrarColor()
//.then(algo => console.log(algo));

//crearColor({r:233,b:221,g:2}) //esto es para hacer una prueba en node de crearColor()
//.then(algo => console.log(algo));

// leerColores() //Esto es para realizar una prueba con node de leerColores()
// .then(colores => console.log(colores))
// .catch(colores => console.log(colores))