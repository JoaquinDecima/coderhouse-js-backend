import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import UserController from './filemanager/userController.js';
import { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';
// import routerProductos from './routers/routerProductos.js';
// import Contenedor from './filemanager/contenedor.js';
import ContenedorSQL from './filemanager/contenedorSQL.js';
import ChatManager from './filemanager/chat.js'
import MongoStore from 'connect-mongo';
// import startEntorno from '../entorno/expressEntorno.js';
import faker from 'faker'
faker.locale = 'es'

const users = new UserController();

passport.use('register', new LocalStrategy(async (req, done) =>{
    console.log(req.body);
    if (await users.addUser(req.body)){
      return done(null, req.body)
    }else{
      console.error("EXPLOTO");
      return done("no se pudo crear usuario")
    }
  })
)

passport.use('login', new LocalStrategy(async (req, user, pass, done)=>{
    let usuario = await users.getUser(user);
    if(usuario && usuario.password == pass){
      return done(null, usuario);
    }else{
      return done(null, false);
    }
  }) 

)

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
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

app.use(session({
  store: MongoStore.create({
      mongoUrl: 'mongodb://jdecima:coderhouse@coderhouse-shard-00-00.gj3mp.mongodb.net:27017,coderhouse-shard-00-01.gj3mp.mongodb.net:27017,coderhouse-shard-00-02.gj3mp.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-80zdtm-shard-0&authSource=admin&retryWrites=true&w=majority',
      mongoOptions: advancedOptions
  }),

  secret: 'patojad.com.ar',
  resave: false,
  saveUninitialized: false/*,
  cookie: {
      maxAge: 4000
  }*/
}))
app.use(passport.initialize());
app.use(passport.session());

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'index.hbs'
}))
app.set('view engine', 'hbs')
// app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Se configura API

// app.use('/api/productos',routerProductos);

app.get('/', async (req,res)=>{
  if (req.session.usuario && chekDate(req.session.date)){
    req.session.date = new Date();
    const productos = JSON.parse(await cont.getAll())
    res.render('index', {productos});
  }else{
    res.redirect('/logout/');
  }
})

app.get('/productos/', (req,res)=>{
  if (req.session.usuario && chekDate(req.session.date)){
    req.session.date = new Date();
    res.render('products');
  }else{
    res.redirect('/logout/');
  }
  
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

app.post('/api/register/', passport.authenticate('register', { 
  failureRedirect: '/failregister',
  successRedirect: '/' 
}))

app.get('/failregister/', (req, res) => {
  res.render('register-error');
})

app.post('/api/login/', passport.authenticate('login', { 
  failureRedirect: '/faillogin',
  successRedirect: '/' 
}))

app.get('/faillogin', (req, res) => {
  res.render('login-error');
})

app.get('/login/', (req,res)=>{
  if (req.session.usuario){
    res.redirect('/')    
  }else{
    res.render('login');
  }
})

app.get('/register/', (req,res)=>{
  if (req.session.usuario){
    res.redirect('/')    
  }else{
    res.render('register');
  }
})

app.get('/logout/', (req,res)=>{
  if (req.session.usuario && chekDate(req.session.date)){
    res.render('logout');    
  }else{
    res.redirect('/login/');
  }
  
})

// app.post('/api/login/', async (req,res)=>{
//   req.session.usuario = req.body.usuario;
//   req.session.name = req.body.name;
//   req.session.lastname = req.body.lastname;
//   req.session.edad = req.body.edad;
//   req.session.avatar = req.body.avatar;
//   req.session.alias = req.body.alias;
//   res.redirect('/');
// })

app.post('/api/logout/', async (req,res)=>{
  req.session.destroy();
  res.redirect('/login/');
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

function chekDate(date){
  let resta = (new Date()).getTime() - date.getTime();
  return(Math.round(resta/ (1000*60) < 10))
}

// Se inicia API

const conectedServer = httpServer.listen(PORT, () => {
  console.log(`Inicio pode verlo en http://localhost:${PORT}`);
})

conectedServer.on('error', error => console.log(`error en servidor ${error}`))
