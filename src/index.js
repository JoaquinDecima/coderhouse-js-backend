import express from 'express';
// import routerProductos from './routers/routerProductos.js';

// SetUp del entorno
const app = express();
const port = process.env.PORT || 8080;

app.set('view engine', 'ejs')
// app.use(express.static('./public'));
// app.use(express.json());

// Se configura API

// app.use('/api/productos',routerProductos);

app.get('/', (req,res)=>{
  res.render('index')
})

app.get('/productos/', (req,res)=>{
  res.render('products')
})

// Se inicia API

app.listen(port);
console.log(`Inicio pode verlo en http://localhost:${port}`);
