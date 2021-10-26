import express from 'express';
import exphbs from 'express-handlebars';
import { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';
// import routerProductos from './routers/routerProductos.js';
import Contenedor from './filemanager/contenedor.js';
import startEntorno from '../entorno/expressEntorno.js';

const cont = new Contenedor('../productos.txt');
startEntorno(cont);

// SetUp del entorno
const app = express();
const httpServer = new HTTPServer(app);
const io = new IOServer(httpServer);
const PORT = process.env.PORT || 8080;

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'index.hbs'
}))
app.set('view engine', 'hbs')
// app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

// Se configura API

// app.use('/api/productos',routerProductos);

app.get('/', (req,res)=>{
  res.render('index', {productos: cont.getAll()});
})

app.get('/productos/', (req,res)=>{
  res.render('products');
})

app.post('/productos/', (req,res)=>{
  cont.save({
    title : req.body.nombre,
    price : req.body.precio,
    thumbnail: req.body.imagen
  })
  res.redirect('/');
})

io.on('connection', socket =>{

  // Se conecta y recive todos los productos
  socket.emit('update-products', cont.getAll());

  // Agrego producto y envio propago Productos
  socket.on('add-product', data => {
    cont.save({
      title : data.nombre,
      price : data.precio,
      thumbnail: data.imagen
    })
    io.socket.emit('update-products', cont.getAll());
  })
})

// Se inicia API

const conectedServer = httpServer.listen(PORT, () => {
  console.log(`Inicio pode verlo en http://localhost:${PORT}`);
})

conectedServer.on('error', error => console.log(`error en servidor ${error}`))
