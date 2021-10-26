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
  const producto = getProduct('Escuadra', 123.45, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Squadra_45.jpg/800px-Squadra_45.jpg');
  const producto2 = getProduct('Calculadora', 234.56, 'https://www.librerialarubrica.com/wp-content/uploads/2020/03/calculadora-cientifica-casio-fx-95ms-.jpg');
  const producto3 = getProduct('Globo Terraqueo', 345.67, 'https://http2.mlstatic.com/D_NQ_NP_926873-MLA43786618401_102020-O.webp');


  let id = micont.save(producto);
  print(`Se agrego elemento id: ${id}`);
  id = micont.save(producto2);
  print(`Se agrego elemento id: ${id}`);
  id = micont.save(producto3);
  print(`Se agrego elemento id: ${id}`);
  let printeable = micont.getAll();
  print(printeable);
}
