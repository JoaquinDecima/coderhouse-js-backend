import express from 'express';
import bcrypt from 'bcryptjs';
import LocalStrategy from 'passport-local';
import UserController from '../model/dao/userController.js';
import passport from 'passport';
import { logger } from '../model/tools/logger.js';

export const routerAPI = express.Router();

const salt = bcrypt.genSaltSync(10);
const users = new UserController();
const usuarios = [];

// Passport Config

passport.use('register', new LocalStrategy(async (username, password, done) =>{
	logger.info('Peticion POST a /api/register/');
	let hashpass = bcrypt.hashSync(password, salt);
	let usuario = {username, password: hashpass};
	if (await users.addUser(usuario)){
		usuarios.push(usuario);
		return done(null, usuario);
	}else{
		return done(false);
	}
}));

passport.use('login', new LocalStrategy(async (username, password, done)=>{
	logger.info('Peticion POST a /api/login/');
	let usuario = await users.getUser(username);
	let hashpass = bcrypt.hashSync(password, salt);
	if(usuario != [] && usuario[0].password == hashpass){
		return done(null, usuario);
	}else{
		return done(null, false);
	}
}));

passport.serializeUser(function (usuario, done) {
	done(null, usuario);
});

passport.deserializeUser(function (usuario, done) {
	done(null, usuario);
});


// API Config

routerAPI.post('/register/', passport.authenticate('register', { 
	failureRedirect: '/failregister',
	failureMessage: true,
	successRedirect: '/' 
}));

routerAPI.post('/login/', passport.authenticate('login', { 
	failureRedirect: '/faillogin',
	successRedirect: '/iniciando' 
}));

routerAPI.get('/data/', (req,res)=>{
	logger.info('Peticion GET a /api/data/');
	let user = req.user[0];
	req.session.username = user.username;
	req.session.date = new Date();
	console.log(user);
	res.setHeader('dbContainerent-Type', 'application/json');
	res.json(user);
});

routerAPI.post('/logout/', (req,res)=>{
	logger.info('Peticion POST a /api/logout/');
	req.session.destroy();
	res.redirect('/login/');
});