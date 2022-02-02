import express from 'express';
import Contenedor from '../filemanager/contenedor.js';
import startEntorno from '../../entorno/expressEntorno.js';

const routerProductos = express.Router();
const cont = new Contenedor('../../productos.txt');
startEntorno(cont);

routerProductos.get('/', function(req, res, next){
	res.send(cont.getAll());
});

routerProductos.get('/:id', function(req, res, next){
	res.send(cont.getByID(req.params.id));
});

routerProductos.post('/', function(req, res, next){
	console.log(req.body);
	const id = cont.save({
		title : req.body.nombre,
		price : req.body.precio,
		thumbnail: req.body.imagen
	});
	res.send({id: id});
});

routerProductos.delete('/:id', function(req, res, next){
	res.send(cont.deleteById(req.params.id));
});

routerProductos.put('/', function(req, res, next){
	if(cont.editByID(req.body.id, req.body.nombre, req.body.precio, req.body.imagen)){
		res.send('');
	}else{
		res.send({error:'Producto no encontrado'});
	}
});

routerProductos.get('/random', function(req, res, next){
	const random = Math.floor(Math.random() * cont.getAll().length);
	res.send(cont.getByID(random));
});

export default routerProductos;
