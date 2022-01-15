import { normalize, schema } from "normalizr";
import FileManager from './filemanager.js';

export default class ChatManager{
  constructor(path){
    this.fileManager = new FileManager(path);
    this.user = new schema.Entity('user');
    this.mensaje = new schema.Entity('mensaje', {
      user: this.user,
    });
  }

  save(object){
    object.date = new Date();

    const content = this.getAll();
    content.push(normalize(object, this.mensaje));

    this.fileManager.writeData(JSON.stringify(content,null,2));
  }

  getAll(){
    return JSON.parse(this.fileManager.readData());
  }
}
