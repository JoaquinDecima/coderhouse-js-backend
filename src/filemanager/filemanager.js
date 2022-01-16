import fs from 'fs';

export default class FileManager{
  constructor(path, format = "[]"){
    this.path = path;
    this.check(format);
  }

  async check(format) {
    try {
      await fs.access(this.path, 'utf8')
    } catch {
      fs.writeFileSync(this.path, format)
    }
  }

  writeData(data){
    fs.writeFileSync(this.path, data, 'utf8');
  }

  readData(){
    return fs.readFileSync(this.path);
  }
}
