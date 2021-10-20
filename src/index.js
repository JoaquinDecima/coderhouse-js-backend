import express from 'express';
import routerProductos from './routers/routerProductos.js'

// SetUp del entorno
const app = express();
const port = process.env.PORT || 8080
const router = express.Router();

app.use(express.static('./public'));
app.use(express.json());

// Se configura API

app.use('/api/productos',routerProductos);

// Se inicia API

app.listen(port);
console.log(`Inicio en el puerto ${port}`);
