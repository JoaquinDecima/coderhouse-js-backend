import express from 'express';
import exphbs from 'express-handlebars';
import { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';
// import routerProductos from './routers/routerProductos.js';
// import Contenedor from './filemanager/contenedor.js';
import ContenedorSQL from './filemanager/contenedorSQL.js';
import ChatManager from './filemanager/chat.js'
// import startEntorno from '../entorno/expressEntorno.js';
import faker from 'faker'
faker.locale = 'es'

const cont = new ContenedorSQL({
  client: 'mysql',
  connection:{
    host: '127.0.0.1',
    port: '3306',
    user: 'jdecima',
    password: 'jdecima',
    database: 'coderhouse'
  }
}, "productos");

const chat = new ChatManager("./chat.data");

// const chat = new ContenedorSQL({
//   client: 'sqlite3',
//   connection: {
//     filename: "./chat.sqlite"
//   }
// },'chat');
// startEntorno(cont);

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

app.get('/', async (req,res)=>{
  const productos = JSON.parse(await cont.getAll())
  res.render('index', {productos});
})

app.get('/productos/', (req,res)=>{
  res.render('products');
})

app.get('/productos-test/', (req,res)=>{
  const productos = [{
    title: faker.commerce.productName,
    price: faker.datatype.number({
        'min': 23,
        'max': 780
      }),
    thumbnail: faker.image.imageUrl
  },{
    title: faker.commerce.productName,
    price: faker.datatype.number({
        'min': 23,
        'max': 780
      }),
    thumbnail: faker.image.imageUrl
  },{
    title: faker.commerce.productName,
    price: faker.datatype.number({
        'min': 23,
        'max': 780
      }),
    thumbnail: faker.image.imageUrl
  },{
    title: faker.commerce.productName,
    price: faker.datatype.number({
        'min': 23,
        'max': 780
      }),
    thumbnail: faker.image.imageUrl
  },{
    title: faker.commerce.productName,
    price: faker.datatype.number({
        'min': 23,
        'max': 780
      }),
    thumbnail: faker.image.imageUrl
  }]
  res.render('list-test', {productos});
})

app.post('/productos/', async (req,res)=>{
  await cont.save({
    title : req.body.nombre,
    price : req.body.precio,
    thumbnail: req.body.imagen
  })
  res.redirect('/');
})

io.on('connection', async socket =>{

  // Se conecta y recive todos los productos
  socket.emit('update-products', JSON.parse(await cont.getAll()));

  // Se conecta y recive todo el historial de mensajes
  socket.emit('update-menssajes', chat.getAll());

  // Agrego producto y envio propago Productos
  socket.on('add-product', async data => {
    await cont.save({
      title : data.nombre,
      price : data.precio,
      thumbnail: data.imagen
    })
    socket.emit('update-products', await cont.getAll());
  })

  // Agrego mensaje y envio propago Mensajes
  socket.on('add-menssaje', data => {
    chat.save({
      author : {
        email: data.usuario,
        nombre: data.name,
        apellido: data.lastname,
        edad: data.edad,
        alias: data.alias,
        avatar: data.avatar
      },
      menssaje : data.mensaje,
      date : new Date()
    })
    socket.emit('update-menssajes', chat.getAll());
  })
})

// Se inicia API

const conectedServer = httpServer.listen(PORT, () => {
  console.log(`Inicio pode verlo en http://localhost:${PORT}`);
})

conectedServer.on('error', error => console.log(`error en servidor ${error}`))
