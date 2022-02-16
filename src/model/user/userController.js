import MongoController from '../../dao/mongoController.js';
import 'dotenv/config';

export default class UserController{
	constructor (){
		this.db = new MongoController(process.env.MONGODB_URL,'myFirstDatabase','users');
	}

	async addUser(user){
		user._id = user.username;
		if ((await this.db.readDataByID(user.username)) != []) {
			await this.db.writeData(user);
			return true;
		}else{
			return false;
		}
	}

	getUser(user){
		return this.db.readDataByID(user);
	}
}