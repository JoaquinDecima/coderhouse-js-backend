import express from 'express';
import exphbs from 'express-handlebars';
// import routerProductos from './routers/routerProductos.js';
import Contenedor from './filemanager/contenedor.js';
import startEntorno from '../entorno/expressEntorno.js';

const cont = new Contenedor('../productos.txt');
startEntorno(cont);

// SetUp del entorno
const app = express();
const port = process.env.PORT || 8080;

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

// Se inicia API

app.listen(port);
console.log(`Inicio pode verlo en http://localhost:${port}`);
