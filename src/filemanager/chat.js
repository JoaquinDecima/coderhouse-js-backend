import { runInThisContext } from 'vm';
import FileManager from './filemanager.js';

export default class ChatManager{
  constructor(path){
    this.fileManager = new FileManager(path);
  }

  save(object){
    object.date = new Date();

    const content = this.getAll();
    content.push(object);

    this.fileManager.writeData(JSON.stringify(content,null,2));
  }

  getAll(){
    return JSON.parse(this.fileManager.readData());
  }
}
