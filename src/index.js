import 'dotenv/config';
import compression from 'compression';
import minimist from 'minimist';
import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import cluster from 'cluster';
import os from 'os';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { dbContainer, dbChat } from './model/dao/databases.js';
import { routerProductos } from './routers/routerProductos.js';
import { routerAPI } from './routers/routerApi.js';
import { isAuth } from './model/middelware/auth.js';
import { logger } from './model/tools/logger.js';

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
app.use(compression());

app.engine('hbs', exphbs({
	extname: 'hbs',
	defaultLayout: 'index.hbs'
}));
app.set('view engine', 'hbs');

// Se configura API

app.use('/productos', routerProductos);
app.use('/api', routerAPI);

app.get('/', isAuth, async (req,res)=>{
	logger.info('Peticion GET a /');
	const productos = JSON.parse(await dbContainer.getAll());
	res.render('index', {productos});
});

app.get('/failregister/', (req, res) => {
	logger.info('Peticion GET a /failregister/');
	res.render('register-error');
});

app.get('/faillogin', (req, res) => {
	logger.info('Peticion GET a /faillogin/');
	res.render('login-error');
});

app.get('/login/', (req,res)=>{
	logger.info('Peticion GET a /login/');
	if (req.session.usuario){
		res.redirect('/');    
	}else{
		res.render('login');
	}
});

app.get('/iniciando/', (req,res)=>{
	logger.info('Peticion GET a /iniciando/');
	res.render('get-data');
});

app.get('/register/', (req,res)=>{
	logger.info('Peticion GET a /registro/');
	if (req.session.usuario){
		res.redirect('/');    
	}else{
		res.render('register');
	}
});

app.get('/logout/', (req,res)=>{
	logger.info('Peticion GET a /logout/');
	res.render('logout');    
});

app.get('/info/', (req,res)=>{
	logger.info('Peticion GET a /info/');
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

app.get('*', function(req, res){
	logger.warn(`404 Ruta no encontrada '${req.url}'`);
	res.status(404).send('404');
});

// Socket

io.on('connection', async socket =>{

	// Se conecta y recive todos los productos
	socket.emit('update-products', JSON.parse(await dbContainer.getAll()));

	// Se conecta y recive todo el historial de mensajes
	socket.emit('update-menssajes', dbChat.getAll());

	// Agrego producto y envio propago Productos
	socket.on('add-product', async data => {
		try { 
			dbContainer.save({
				title : data.nombre,
				price : data.precio,
				thumbnail: data.imagen
			});
		}
		catch{
			logger.error('Error al guardar producto');
		}
		socket.emit('update-products', await dbContainer.getAll());
	});

	// Agrego mensaje y envio propago Mensajes
	socket.on('add-menssaje', data => {
		try{
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
		}
		catch{
			logger.error('Error al guardar el mensaje');
		}
		
		socket.emit('update-menssajes', dbChat.getAll());
	});
});

// Se inicia API
if (nodeParams.modo == 'cluster' && cluster.isPrimary){
	console.log(`PID MASTER ${process.pid}`);

	for (let i = 0; i < os.cpus().length; i++) {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
		console.log(`Worker ${worker.process.pid} died [${code}] - ${signal}`);
		cluster.fork();
	});
} else {
	const conectedServer = httpServer.listen((parseInt(process.argv[2]) || PORT), err => {
		if (!err){
			console.log(`Inicio pode verlo en http://localhost:${(parseInt(process.argv[2]) || PORT)} [${process.pid}]`);
		}
	});

	conectedServer.on('error', error => logger.error(`error en servidor ${error}`));
}
