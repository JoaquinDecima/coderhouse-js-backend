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

export default function startEntorno(micont){
  const producto = getProduct('Escuadra', 123.45, 'https://patojad.com.ar/nof.svg');
  const producto2 = getProduct('Calculadora', 234.56, 'https://serscout.com.ar/nof.svg');
  const producto3 = getProduct('Globo Terraqueo', 345.67, 'https://lynx.net.ar/nof.svg');


  let id = micont.save(producto);
  print(`Se agrego elemento id: ${id}`);
  id = micont.save(producto2);
  print(`Se agrego elemento id: ${id}`);
  id = micont.save(producto3);
  print(`Se agrego elemento id: ${id}`);
  let printeable = micont.getAll();
  print(printeable);
}
