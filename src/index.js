import 'dotenv/config';
import minimist from 'minimist';
import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import UserController from './filemanager/userController.js';
import bcrypt from 'bcryptjs';
import { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';
// import routerProductos from './routers/routerProductos.js';
// import Contenedor from './filemanager/contenedor.js';
import ContenedorSQL from './filemanager/contenedorSQL.js';
import ChatManager from './filemanager/chat.js'
import MongoStore from 'connect-mongo';
// import startEntorno from '../entorno/expressEntorno.js';
import faker from 'faker';
faker.locale = 'es';

const salt = bcrypt.genSaltSync(10);
const users = new UserController();
const usuarios = [];

passport.use('register', new LocalStrategy(async (username, password, done) =>{
  let hashpass = bcrypt.hashSync(password, salt);
  let usuario = {username, password: hashpass};
    if (await users.addUser(usuario)){
      usuarios.push(usuario);
      return done(null, usuario);
    }else{
      return done(false);
    }
  })
)

passport.use('login', new LocalStrategy(async (username, password, done)=>{
    let usuario = await users.getUser(username);
    let hashpass = bcrypt.hashSync(password, salt);
    if(usuario != [] && usuario[0].password == hashpass){
      return done(null, usuario);
    }else{
      return done(null, false);
    }
  }) 

)

passport.serializeUser(function (usuario, done) {
  done(null, usuario);
});

passport.deserializeUser(function (usuario, done) {
  done(null, usuario);
});

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const cont = new ContenedorSQL({
  client: 'mysql',
  connection:{
    host: process.env.MYSQL_HOST,
    port: '3306',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE
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
const PORT = minimist(process.argv.slice(2)).port || process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
  store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      mongoOptions: advancedOptions
  }),

  secret: 'patojad.com.ar',
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 60 * 10
  }
}))
app.use(passport.initialize());
app.use(passport.session());

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'index.hbs'
}))
app.set('view engine', 'hbs')
// app.use(express.static('./public'));

function isAuth(req, res, next) {
  if (req.session.username && chekDate(req.session.date)){
    req.session.date = new Date();
    next()
  } else {
    res.redirect('/logout/')
  }
}

function log(req, res, next){
  console.log(req);
  next()
}

// Se configura API

// app.use('/api/productos',routerProductos);

app.get('/', isAuth, async (req,res)=>{
  const productos = JSON.parse(await cont.getAll())
  res.render('index', {productos});
})

app.get('/productos/', isAuth, (req,res)=>{
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

app.post('/api/register/', passport.authenticate('register', { 
  failureRedirect: '/failregister',
  failureMessage: true,
  successRedirect: '/' 
}))

app.post('/api/login/', passport.authenticate('login', { 
  failureRedirect: '/faillogin',
  successRedirect: '/iniciando' 
}))

app.get('/api/data/', (req,res)=>{
  let user = req.user[0];
  req.session.username = user.username;
  req.session.date = new Date();
  console.log(user);
  res.setHeader('Content-Type', 'application/json');
  res.json(user);
})

app.post('/api/logout/', (req,res)=>{
  req.session.destroy();
  res.redirect('/login/');
})

app.get('/failregister/', (req, res) => {
  res.render('register-error');
})

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

app.get('/iniciando/', (req,res)=>{
  res.render('get-data');
})

app.get('/register/', (req,res)=>{
  if (req.session.usuario){
    res.redirect('/')    
  }else{
    res.render('register');
  }
})

app.get('/logout/', (req,res)=>{
  res.render('logout');    
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
  if (date){
    let oldDate = new Date(date)
    let resta = (new Date()).getTime() - oldDate.getTime();
    return(Math.round(resta/ (1000*60) < 10))
  }else{
    return false;
  }
  
}

// Se inicia API

const conectedServer = httpServer.listen(PORT, () => {
  console.log(`Inicio pode verlo en http://localhost:${PORT}`);
})

conectedServer.on('error', error => console.log(`error en servidor ${error}`))
