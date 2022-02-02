import { isAuth } from '../model/middelware/auth';
import express from 'express';
import faker from 'faker';
import { dbContainer } from '../model/dao/databases';
faker.locale = 'es';

export const routerProductos = express.Router();

routerProductos.get('/', isAuth, (req,res)=>{
	res.render('products');
});

routerProductos.get('/test', (req,res)=>{
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

routerProductos.post('/', async (req,res)=>{
	await dbContainer.save({
		title : req.body.nombre,
		price : req.body.precio,
		thumbnail: req.body.imagen
	});
	res.redirect('/');
});