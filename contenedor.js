import { runInThisContext } from 'vm';
import FileManager from './filemanager.js';

export default class Contenedor{
  lastObjectID = 0;

  constructor(path){
    this.fileManager = new FileManager(path);
  }

  async save(object){
    this.lastObjectID += 1;               // Incremento ID
    object.id = this.lastObjectID;        // Seteo ID (Preferiblemente se utilizaria otro nombre porque ID es muy comun)
    
    const content = await this.getAll();  // Obtengo todo lo que dispongo en el archivo
    content.push(object);                 // Le agrego el nuevo Objeto

    await this.fileManager.writeData(JSON.stringify(content,null,2));

    return this.lastObjectID;
  }

  async getAll(){
    return await JSON.parse(this.fileManager.readData());
  }

  async getByID(numID){
    const elems = await this.getAll();
    return elems.find(elem => elem.id == numID);
  }

  async deleteById(numID){
    let elems = await this.getAll();
    elems = elems.filter(elem => elem.id != numID);
    await this.fileManager.writeData(JSON.stringify(elems,null,2));
  }

  async deleteAll(){
    this.lastObjectID = 0;
    await this.fileManager.writeData('[]');
  }
}
