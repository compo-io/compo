import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as webpack from "webpack";
import {Configuration, Stats} from 'webpack';
import {CompoFile} from "./CompoFile";
import {PackageFile} from "./PackageFile";
import {AuthFile} from "./AuthFile";

declare const process: NodeJS.Process;

declare type Require = { resolve(): any }
declare const require: Require;

const componentFile = 'component.js';
const entryFile = 'entry.js';

export class Builder {

    private auth: AuthFile;
    private dir: string;
    private cwd: string = process.cwd();
    private component: CompoFile;
    private package: PackageFile;

    constructor(cwd: string = process.cwd()) {
        // define cwd
        this.cwd = cwd;
        // create tmp build directory
        this.dir = fs.mkdtempSync(path.join(os.tmpdir(), 'compo_build'));
        this.auth = AuthFile.get();
    }

    public build(): Promise<BuildResult> {
        return new Promise<BuildResult>(
            (resolve, reject) => {
                // read compo file
                this.component = CompoFile.read(this.cwd);
                // read package file
                this.package = PackageFile.read(this.cwd);
                // create entry file
                this
                    .makeEntryFile()
                    .webpackBuild()
                    .then(this.wrap.bind(this))
                    .catch(reject);
            }
        );
    }

    protected makeEntryFile(): Builder {
        const contents = `
import Component from '${path.join(this.cwd, this.package.main)}';
customElements.define('${this.component.name}', Component);
`;
        fs.writeFileSync(path.join(this.dir, entryFile), contents);
        return this;
    }

    protected wrap(): Builder {
        const original = fs.readFileSync(path.join(this.dir, componentFile), 'utf8');
        const contents = `/**
 * @component ${this.component.name}
 * @copyright @${this.component.owner} ${new Date().getFullYear()}
 * @url ${this.component.getUrl()}
 */
((c,o,m,p)=>{p=c.createElement.bind(c);
('registerElement'in c&&'import'in p('link')&&'content'in p('template'))
?(m.call(window),o.log(\`* This page uses a shared component: ${this.component.getUrl()}\`))
:o.error(\`Browser doesn't support web components, use component loader\`)
})(document,console,()=>{${original}})`;
        fs.writeFileSync(path.join(), contents, 'utf8');
        return this;
    }

    protected webpackBuild(): Promise<Stats> {
        return new Promise<Stats>((resolve, reject) => {
            webpack(this.webpackConfig())
                .run((err: Error, stats: Stats) => {
                    if (err !== null) {
                        reject(err);
                        return;
                    }
                    resolve(stats);
                });
        });
    }

    protected webpackConfig(): Configuration {
        return {
            mode: 'production',
            entry: entryFile,
            output: {
                path: this.dir,
                filename: componentFile,
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                'babel-preset-es2017',
                            ].map(require.resolve),
                        },
                    },
                    {
                        test: /\.css$/,
                        use: [
                            "style-loader",
                            "css-loader",
                        ],
                    },
                ],
            },
            resolveLoader: {
                modules: [
                    `${__dirname}/node_modules`,
                ],
            },
        }
    }

    clean() {

    }


}

export class BuildResult {
    public errors: Error[] = [];
}
