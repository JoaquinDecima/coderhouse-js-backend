import Contenedor from './contenedor.js'

// Funciones auxiliares 

function getProduct(nombre, precio, imagen) {
  return({
    title : nombre,
    price : precio,
    thumbnail: imagen
  })
}
const print = console.log

// Se prepara entorno

const producto = getProduct('Escuadra', 123.45, 'https://patojad.com.ar/nof.svg');
const producto2 = getProduct('Calculadora', 234.56, 'https://serscout.com.ar/nof.svg');
const producto3 = getProduct('Globo Terraqueo', 345.67, 'https://lynx.net.ar/nof.svg');

const micont = new Contenedor('./productos.txt');

print('##############################################################');
print('##                                                          ##');
print('##                      INICIO DE TEST                      ##');
print('##                                                          ##');
print('##############################################################');
print('');
print('');
print('AGREGO UN ELEMENTO Y REVISO EL FILE');
print('--------------------------------------------------------------');
print('');

let id = await micont.save(producto);
print(`Se agrego elemento id: ${id}`);
let printeable = await micont.getAll();
print(printeable);

print('');
print('');
print('AGREGO DOS ELEMENTOS MAS Y REVISO EL FILE');
print('--------------------------------------------------------------');
print('');

id = await micont.save(producto2);
print(`Se agrego elemento id: ${id}`);
id = await micont.save(producto3);
print(`Se agrego elemento id: ${id}`);
printeable = await micont.getAll();
print(printeable);

print('');
print('');
print('OBTENGO EL ID 2');
print('--------------------------------------------------------------');
print('');

printeable = await micont.getByID(2);
print(printeable);

print('');
print('');
print('ELIMINO EL ID 2 Y VERIFICO EL FILE');
print('--------------------------------------------------------------');
print('');

await micont.deleteById(2);
printeable = await micont.getAll();
print(printeable);

print('');
print('');
print('ELIMINO TODO Y VERIFICO EL FILE');
print('--------------------------------------------------------------');
print('');

await micont.deleteAll();
printeable = await micont.getAll();
print(printeable);