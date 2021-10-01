import express from 'express';
import Contenedor from './src/filemanager/contenedor.js';
import startEntorno from './entorno/expressEntorno.js';
import bodyParser from 'body-parser';
// SetUp del entorno
const app = express();
const port = process.env.PORT || 8080
const cont = new Contenedor('./productos.txt');
const router = express.Router();

startEntorno(cont);
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api',router);

// Se configura API

router.get('/productos', function(req, res, next){
  res.send(cont.getAll());
});

router.get('/productoRandom', function(req, res, next){
  const random = Math.floor(Math.random() * cont.getAll().length);
  res.send(cont.getByID(random));
});

router.get('/productos/:id', function(req, res, next){
  res.send(cont.getByID(req.params.id));
});

router.post('/productos', function(req, res, next){
  console.log(req.body)
  res.send(cont.save({
    title : req.body.nombre,
    price : req.body.precio,
    thumbnail: req.body.imagen
  }));
});

router.delete('/productos/:id', function(req, res, next){
  res.send(cont.deleteById(req.params.id));
});

router.put('/productos', function(req, res, next){
  if(cont.editByID(req.body.id, req.body.nombre, req.body.precio, req.body.imagen)){
    res.send("");
  }else{
    res.send({error:'Producto no encontrado'});
  }
});

// Se inicia API

app.listen(port);
console.log(`Inicio en el puerto ${port}`);
