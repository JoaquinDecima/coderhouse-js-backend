import knex from 'knex';

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

  async editByID(id, title, price, thumbnail){
    await this.dbManager(this.table).where(id).update({
        title,
        price,
        thumbnail
    })
  }
}
