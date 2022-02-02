# CoderHouse BackEnd Curso

* **Alumno:** Joaquin (Pato) Decima
* **Curso:** Pregamacion BackEnd
* **Comision:** 23470
* **Folder** Entregas

En el siguiente repositorio vemos el progreso y las entregas en forma de Releases

## Instalacion y ejecucion de Proyecto

La instalacion y ejecuccion de proyecto es simple para esto debemos tener `node` instalado y `npm`

```bash
git clone https://github.com/JoaquinDecima/coderhouse-js-backend.git
cd coderhouse-js-backend
npm i
npm start
```

El proyecto permite utilizar variables para modificar el comportamiento, estos parametros son los siguientes:

* `--port=` permite cambiar el numero de puerto en el cual corre el proyecto *(default 8080)*
* `--modo=` permite cambiar el modo cluster y fork *(default fork)*

Un ejemplo del uso de esto es:

```bash
npm start -- --modo=cluster --port=4000
```