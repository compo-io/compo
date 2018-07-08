export class User {
    public login: string;

    constructor(data: object = {}) {
        Object.assign(this, data);
    }

    public getUrl(): string {
        return `https://compo.io/${this.login}`;
    }
}
