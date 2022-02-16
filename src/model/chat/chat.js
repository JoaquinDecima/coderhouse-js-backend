import { normalize, schema, denormalize } from 'normalizr';
import FileManager from '../../dao/filemanager.js';

export default class ChatManager{
	constructor(path){
		this.nextID = 1;
		this.author = new schema.Entity('author', {}, {idAttribute: 'email'});
		this.mensaje = new schema.Entity('mensaje', {
			author: this.author,
		});
		this.chat = new schema.Entity('chat',{
			mensajes: [this.mensaje]
		});
		this.fileManager = new FileManager(path, JSON.stringify({id:'mensajes', mensajes:[]}));
	}

	save(object){
		object.date = new Date();
		object.id = this.nextID;
		this.nextID += 1;
		const contentNorm = this.getAll();
		var content = contentNorm;

		if (!contentNorm.mensajes){
			content = denormalize(contentNorm.result, this.chat, contentNorm.entities);
		}

		content.mensajes.push(object);
		this.fileManager.writeData(JSON.stringify(normalize(content, this.chat),null,2));
	}

	getAll(){
		return JSON.parse(this.fileManager.readData());
	}
}
