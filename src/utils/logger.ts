import fs from 'fs';
import { Maybe } from './maybe';
import { resolvePath } from './paths';

export class Logger {
  constructor() {
    fs.mkdir(resolvePath(), () => {
      fs.writeFile(resolvePath(['prod.log']), 'created', () => {
        this.logStream = fs.createWriteStream(resolvePath(['prod.log']));
      });
    });
  }

  public log(log: any = 'undefined') {
    if (!log || !this.logStream) return;
    this.logStream.write('\n');
    this.logStream.write(JSON.stringify(log));
  }

  public logStream: Maybe<fs.WriteStream>;
}
