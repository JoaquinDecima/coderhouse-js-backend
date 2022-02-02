import 'dotenv/config';
import minimist from 'minimist';
import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import { dbContainer, dbChat } from './model/dao/databases.js';
import { routerProductos } from './routers/routerProductos.js';
import { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';
import os from 'os';
import passport from 'passport';
// import routerProductos from './routers/routerProductos.js';
// import dbContainerenedor from './filemanager/dbContainerenedor.js';
import MongoStore from 'connect-mongo';
// import startEntorno from '../entorno/expressEntorno.js';
import { isAuth } from './model/middelware/auth.js';

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// SetUp del entorno
const nodeParams = minimist(process.argv.slice(2));
const app = express();
const httpServer = new HTTPServer(app);
const io = new IOServer(httpServer);
const PORT = nodeParams.port || process.env.PORT || 8080;

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
}));
app.use(passport.initialize());
app.use(passport.session());

app.engine('hbs', exphbs({
	extname: 'hbs',
	defaultLayout: 'index.hbs'
}));
app.set('view engine', 'hbs');

// Se configura API

app.use('/productos',routerProductos);

app.get('/', isAuth, async (req,res)=>{
	const productos = JSON.parse(await dbContainer.getAll());
	res.render('index', {productos});
});

app.get('/failregister/', (req, res) => {
	res.render('register-error');
});

app.get('/faillogin', (req, res) => {
	res.render('login-error');
});

app.get('/login/', (req,res)=>{
	if (req.session.usuario){
		res.redirect('/');    
	}else{
		res.render('login');
	}
});

app.get('/iniciando/', (req,res)=>{
	res.render('get-data');
});

app.get('/register/', (req,res)=>{
	if (req.session.usuario){
		res.redirect('/');    
	}else{
		res.render('register');
	}
});

app.get('/logout/', (req,res)=>{
	res.render('logout');    
});

app.get('/info/', (req,res)=>{
	res.render('info',{
		args: JSON.stringify(nodeParams),
		platform: process.platform,
		process_id: process.pid,
		folder: process.env.PWD,
		node_version: process.versions.node,
		memory: process.memoryUsage().rss,
		cores: os.cpus().length
	});
});

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
	socket.emit('update-products', JSON.parse(await dbContainer.getAll()));

	// Se conecta y recive todo el historial de mensajes
	socket.emit('update-menssajes', dbChat.getAll());

	// Agrego producto y envio propago Productos
	socket.on('add-product', async data => {
		await dbContainer.save({
			title : data.nombre,
			price : data.precio,
			thumbnail: data.imagen
		});
		socket.emit('update-products', await dbContainer.getAll());
	});

	// Agrego mensaje y envio propago Mensajes
	socket.on('add-menssaje', data => {
		dbChat.save({
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
		});
		socket.emit('update-menssajes', dbChat.getAll());
	});
});


// Se inicia API

const conectedServer = httpServer.listen(PORT, () => {
	console.log(`Inicio pode verlo en http://localhost:${PORT}`);
});

conectedServer.on('error', error => console.log(`error en servidor ${error}`));
