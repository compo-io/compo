declare let process: NodeJS.Process;

import * as fs from 'fs';
import * as path from 'path';

const compoFile = 'compo.json';

/**
 * @class CompoFile
 * @classdesc A class for working with compo files
 */
export class CompoFile {

    /**
     * @name path
     * @desc Returns absolute path to compo file
     * @param {string} cwd
     * @returns {string}
     */
    static path(cwd: string = process.cwd()): string {
        return path.join(cwd, compoFile);
    }

    /**
     * @name exists
     * @decs Returns true if compo file exists in cwd
     * @param {string} cwd
     * @returns {boolean}
     */
    static exists(cwd: string = process.cwd()): boolean {
        return fs.existsSync(CompoFile.path(cwd))
    }

    /**
     * @name read
     * @desc Reads the contents of compo file
     * @param {string} cwd
     * @returns {CompoFile}
     * @throws {Error}
     */
    static read(cwd: string = process.cwd()): CompoFile {
        if (!CompoFile.exists(cwd)) {
            throw new Error('compo file does not exists');
        }
        const compo = new CompoFile(JSON.parse(fs.readFileSync(CompoFile.path(cwd), 'utf8')));
        const err = compo.validate();
        if (err !== null) {
            throw err;
        }
        return compo;
    }

    /**
     * @name write
     * @desc Writes data to compo file
     * @param {string} cwd
     * @param {CompoFile} data
     * @throws {Error}
     */
    static write(cwd: string = process.cwd(), data: CompoFile): void {
        fs.writeFileSync(CompoFile.path(cwd), JSON.stringify(data));
    }

    /**
     * @constructor
     * @param {object} data
     */
    constructor(data: object) {
        Object.assign(this, data);
    }

    public name: string;
    public owner: string;

    public getUrl(): string {
        return `https://compo.io/${this.owner}/${this.name}`;
    }

    public validate(): Error {
        if (this.name === undefined || this.name.trim() == '') {
            return new Error('invalid component name');
        }
        if (this.owner === undefined || this.owner.trim() == '') {
            return new Error('invalid owner');
        }
        return null;
    }

}
