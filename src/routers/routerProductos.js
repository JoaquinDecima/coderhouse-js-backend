import { isAuth } from '../model/middelware/auth.js';
import express from 'express';
import faker from 'faker';
import { dbContainer } from '../model/tools/databases.js';
import { logger } from '../model/tools/logger.js';
faker.locale = 'es';

export const routerProductos = express.Router();

routerProductos.get('/', isAuth, (req,res)=>{
	logger.info('Peticion GET a /productos/');
	res.render('products');
});

routerProductos.get('/test', (req,res)=>{
	logger.info('Peticion GET a /productos/test');
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
	}];
	res.render('list-test', {productos});
});

routerProductos.post('/', (req,res)=>{
	logger.info('Peticion POST a /productos/');
	try{
		dbContainer.save({
			title : req.body.nombre,
			price : req.body.precio,
			thumbnail: req.body.imagen
		});
	}
	catch{
		logger.error('Error al guardar Producto');
	}
	res.redirect('/');
});