
import ContenedorSQL from './contenedorSQL.js';
import ChatManager from './chat.js';

export const dbContainer = new ContenedorSQL({
	client: 'mysql',
	connection:{
		host: process.env.MYSQL_HOST,
		port: '3306',
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASS,
		database: process.env.MYSQL_DATABASE
	}
}, 'productos');

export const dbChat = new ChatManager('./chat.data');