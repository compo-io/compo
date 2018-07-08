import {CompoFile} from "./CompoFile";
import * as fs from 'fs';
import * as path from 'path';
import {expect} from 'chai';
import {describe} from 'mocha'

describe('CompoFile', () => {
    it('should exist', () => {
        expect(typeof CompoFile).to.equal('function');
    });
    it('should have method path()', () => {
        expect(typeof CompoFile.path).to.equal('function');
        expect(CompoFile.path('/tmp')).to.equal('/tmp/compo.json');
        expect(CompoFile.path()).to.equal(`${process.cwd()}/compo.json`);
    });
    it('should have method exists()', () => {
        expect(typeof CompoFile.exists).to.equal('function');
        const dir = fs.mkdtempSync('/tmp/compo_test');
        expect(CompoFile.exists(dir)).to.equal(false);
        fs.writeFileSync(path.join(dir, 'compo.json'), `{"name":"compo_component"}`);
        expect(CompoFile.exists(dir)).to.equal(true);
        fs.unlinkSync(path.join(dir, 'compo.json'));
        fs.rmdirSync(dir);
    });
    it('should have method read()', () => {
        expect(typeof CompoFile.read).to.equal('function');
        const dir = fs.mkdtempSync('/tmp/compo_test');
        fs.writeFileSync(path.join(dir, 'compo.json'), `{"name":"compo_component","owner":"compo_owner"}`);
        const compo = CompoFile.read(dir);
        expect(compo).an.instanceof(CompoFile);
        expect(compo.name).to.equal('compo_component');
        fs.unlinkSync(path.join(dir, 'compo.json'));
        fs.rmdirSync(dir);
        expect(() => {
            CompoFile.read(dir)
        }).to.throw();
    });
    it('should have method write()', () => {
        expect(typeof CompoFile.write)
            .to.equal('function');
        const dir = fs.mkdtempSync('/tmp/compo_test');
        const compo = new CompoFile({name: 'some_component'});
        expect(() => CompoFile.write(dir, compo))
            .to.not.throw();
        expect(fs.readFileSync(path.join(dir, 'compo.json'), 'utf8'))
            .to.equal(`{"name":"some_component"}`);
        fs.unlinkSync(path.join(dir, 'compo.json'));
        fs.rmdirSync(dir);
    })
});

