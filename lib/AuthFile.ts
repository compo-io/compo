import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import {User} from "./User";

export class AuthFile {

    static path(home: string = os.homedir()) {
        return path.join(home, '.compo');
    }

    static exists(home: string = os.homedir()) {
        return fs.existsSync(AuthFile.path(home))
    }

    static get(home: string = os.homedir()): User {
        if (!AuthFile.exists(home)) {
            throw new Error('.compo file not found, you are not authorized');
        }
        return new User(JSON.parse(fs.readFileSync(AuthFile.path(home), 'utf8')))
    }

}

