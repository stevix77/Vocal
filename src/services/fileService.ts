import { Injectable } from '@angular/core';
@Injectable()
export class FileService {
  constructor(){
    
  }

  createFile() {
    this.file = new File();
    this.file.createFile(this.getFilePath(), this.filename, true).then(() => {
      let path = this.getFilePath().replace(/^file:\/\//, '');
      this.mediaObject = this.media.create(path + this.filename);
      this.mediaObject.onStatusUpdate.subscribe(this.onMediaStatusUpdate);
      this.mediaObject.startRecord();
    }).catch(err => {
        this.exceptionService.Add(err);
    });
  }
}