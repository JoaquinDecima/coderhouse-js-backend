import Mongodb from 'mongodb';

export default class MongoController{
	constructor(uri, db, collection){
		this.client = new Mongodb.MongoClient(uri);
		this.db = db;
		this.collection = collection;
	}

	async writeData(data){
		try {
			await this.client.connect();
			await this.client.db(this.db).collection(this.collection).insertOne(data);
		} finally {
			await this.client.close();
		}
	}

	async updateData(data, filter){
		try {
			await this.client.connect();
			await this.client.db(this.db).collection(this.collection).updateOne(filter, {
				$set: data
			}, { upsert: true });
		} finally {
			await this.client.close();
		}
	}

	async deleteByID(id){
		try {
			await this.client.connect();
			await this.client.db(this.db).collection(this.collection).deleteOne({_id:id});
		}finally {
			await this.client.close();
		}
	}

	async readData(){
		let returner;
		try {
			await this.client.connect();
			returner = await this.client.db(this.db).collection(this.collection).find().toArray();
		} finally {
			await this.client.close();
		}
		return returner;
	}

	async readDataByID(id){
		let returner;
		try {
			await this.client.connect();
			returner = await this.client.db(this.db).collection(this.collection).find({_id:id}).toArray();
		} finally {
			await this.client.close();
		}
		return returner;
	}
}