/* Esto Fue desarrollado y Testeado para MariaDB 
 * 
 * Creado por Joaquin (Pato) Decima
 * 
 * Tanto el usuario como la base se encunetran hardcodeados en el codigo
 * y aqui. Por lo cual se sugiere que ante cualquier cambio revise los
 * siguientes archivos de configuracion:
 *
 *   * /src/routers/routersProductos.js
 */

USE coderhouse;

CREATE TABLE productos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, /* ID auto incrementable seteado como primary key*/
  title VARCHAR(200),
  price DECIMAL(6,2),
  thumbnail VARCHAR(1000)
);

INSERT INTO productos (title, price, thumbnail)
    VALUES('Escuadra', 450.00, "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Squadra_45.jpg/800px-Squadra_45.jpg"),
          ('Calculadora', 2500.75, "https://www.librerialarubrica.com/wp-content/uploads/2020/03/calculadora-cientifica-casio-fx-95ms-.jpg"),
          ('Globo Terraqueo', 1599.99, "https://http2.mlstatic.com/D_NQ_NP_926873-MLA43786618401_102020-O.webp");