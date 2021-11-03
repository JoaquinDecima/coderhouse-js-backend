import FileManager from './filemanager.js';
import knex from 'knex';
import { json } from 'express';

export default class ContenedorSQL{
  lastObjectID = 0;

  constructor(config, tableName){
    this.dbManager = knex(config);
    this.table = tableName;
  }

  async save(object){
    const nId = await this.dbManager(this.table).insert(object);
    return nId[0];
  }

  async getAll(){
    return JSON.stringify(await this.dbManager(this.table).select());
  }

  async getByID(id){
    return JSON.stringify(await this.dbManager(this.table).select().where(id));
  }

  async deleteById(id){
    await this.dbManager(this.table).where(id).del();
  }

//   deleteAll(){
//     this.lastObjectID = 0;
//     this.fileManager.writeData('[]');
//   }

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
    //this.fileManager.writeData(JSON.stringify(elems,null,2));
    return cambio
  }
}
