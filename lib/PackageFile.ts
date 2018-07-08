import * as fs from 'fs';
import * as path from 'path';

declare const process: NodeJS.Process;

export class PackageFile {

    static path(cwd: string = process.cwd()): string {
        return path.join(cwd, 'package.json');
    }

    static exists(cwd: string = process.cwd()): boolean {
        return fs.existsSync(PackageFile.path(cwd));
    }

    static read(cwd: string = process.cwd()): PackageFile {
        return new PackageFile(JSON.parse(fs.readFileSync(PackageFile.path(cwd), 'utf8')));
    }

    constructor(data: object) {
        Object.assign(this, data);
    }

    public name: string;
    public version: string;
    public main: string;

}
