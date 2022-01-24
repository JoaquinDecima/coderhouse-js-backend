import MongoController from "./mongoController.js";

export default class UserController{
    constructor (){
        this.db = new MongoController('mongodb://jdecima:coderhouse@coderhouse-shard-00-00.gj3mp.mongodb.net:27017,coderhouse-shard-00-01.gj3mp.mongodb.net:27017,coderhouse-shard-00-02.gj3mp.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-80zdtm-shard-0&authSource=admin&retryWrites=true&w=majority',"myFirstDatabase","users")
    }

    async addUser(user){
        user._id = user.usuario;
        console.log(await this.db.readDataByID(user.usuario));
        if (!(await this.db.readDataByID(user.usuario))) {
            await this.db.writeData(user);
            return true
        }else{
            return false
        }
    }

    getUser(user){
        return this.db.readDataByID(user);
    }
}