import FileManager from './filemanager.js';

export default class Contenedor{
  lastObjectID = 0;

  constructor(path){
    this.fileManager = new FileManager(path);
  }

  save(object){
    console.log(object)
    this.lastObjectID += 1;               // Incremento ID
    object.id = this.lastObjectID;        // Seteo ID (Preferiblemente se utilizaria otro nombre porque ID es muy comun)

    const content = this.getAll();  // Obtengo todo lo que dispongo en el archivo
    content.push(object);                 // Le agrego el nuevo Objeto

    this.fileManager.writeData(JSON.stringify(content,null,2));

    return this.lastObjectID;
  }

  getAll(){
    return JSON.parse(this.fileManager.readData());
  }

  getByID(numID){
    const elems = this.getAll();
    return elems.find(elem => elem.id == numID);
  }

  deleteById(numID){
    let elems = this.getAll();
    elems = elems.filter(elem => elem.id != numID);
    this.fileManager.writeData(JSON.stringify(elems,null,2));
  }

  deleteAll(){
    this.lastObjectID = 0;
    this.fileManager.writeData('[]');
  }

  editByID(id, nombre, precio, imagen){
    const elems = this.getAll();
    var cambio = false
    elems.forEach(elem =>{
      if (elem.id == id){
        elem.title = nombre;
        elem.price = precio;
        elem.thumbnail = imagen;
        cambio = true
      }
    })
    this.fileManager.writeData(JSON.stringify(elems,null,2));
    return cambio
  }
}
