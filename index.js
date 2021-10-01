import express from 'express';
import Contenedor from './src/filemanager/contenedor.js'
import startEntorno from './entorno/expressEntorno.js'

// SetUp del entorno
const app = express();
const port = process.env.PORT || 8080
const cont = new Contenedor('./productos.txt');
const router = express.Router()

startEntorno(cont);

app.use('/api',router);

// Se configura API

router.get('/productos', function(req, res, next){
  res.send(cont.getAll());
});

router.get('/productoRandom', function(req, res, next){
  const random = Math.floor(Math.random() * cont.getAll().length);
  res.send(cont.getByID(random));
});

// Se inicia API

app.listen(port);
console.log(`Inicio en el puerto ${port}`);
