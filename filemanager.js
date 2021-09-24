import fs from 'fs';

export default class FileManager{
  constructor(path){
    this.path = path;
    this.check();
  }

  async check() {
    try {
      await fs.access(this.path, 'utf8')
    } catch {
      fs.writeFileSync(this.path,'[]')
    }
  }

  async writeData(data){
    await fs.writeFile(this.path, data, 'utf8');
  }

  async readData(){
    return (await fs.readFile(this.path));
  }
}
