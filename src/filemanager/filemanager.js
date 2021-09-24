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

  writeData(data){
    fs.writeFileSync(this.path, data, 'utf8');
  }

  readData(){
    return fs.readFileSync(this.path);
  }
}
