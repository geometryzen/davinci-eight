import { Engine } from './Engine';
import { Mesh } from './Mesh';
import refChange from './refChange';

describe("Mesh", function () {
    it("constructor", function () {
        refChange('start');
        const engine = new Engine();
        const mesh = new Mesh(void 0, void 0, engine);

        expect(mesh.position.x).toBe(0);
        expect(mesh.position.y).toBe(0);
        expect(mesh.position.z).toBe(0);

        expect(mesh.X.x).toBe(0);
        expect(mesh.X.y).toBe(0);
        expect(mesh.X.z).toBe(0);

        expect(mesh.attitude.a).toBe(1);
        expect(mesh.attitude.xy).toBe(0);
        expect(mesh.attitude.yz).toBe(0);
        expect(mesh.attitude.zx).toBe(0);

        expect(mesh.R.a).toBe(1);
        expect(mesh.R.xy).toBe(0);
        expect(mesh.R.yz).toBe(0);
        expect(mesh.R.zx).toBe(0);

        mesh.release();
        engine.release();
        refChange('stop');
        expect(refChange('dump')).toBe(0);
    });
    it("X should alias position", function () {
        refChange('start');
        const engine = new Engine();
        const mesh = new Mesh(void 0, void 0, engine);

        mesh.X.x = 1;
        mesh.X.y = 2;
        mesh.X.z = 3;

        expect(mesh.position.x).toBe(1);
        expect(mesh.position.y).toBe(2);
        expect(mesh.position.z).toBe(3);

        expect(mesh.X.x).toBe(1);
        expect(mesh.X.y).toBe(2);
        expect(mesh.X.z).toBe(3);

        mesh.release();
        engine.release();
        refChange('stop');
        expect(refChange('dump')).toBe(0);
    });
    it("R should alias attitude", function () {
        refChange('start');
        const engine = new Engine();
        const mesh = new Mesh(void 0, void 0, engine);

        mesh.R.a = 2;
        mesh.R.xy = 3;
        mesh.R.yz = 5;
        mesh.R.zx = 7;

        expect(mesh.attitude.a).toBe(2);
        expect(mesh.attitude.xy).toBe(3);
        expect(mesh.attitude.yz).toBe(5);
        expect(mesh.attitude.zx).toBe(7);

        expect(mesh.R.a).toBe(2);
        expect(mesh.R.xy).toBe(3);
        expect(mesh.R.yz).toBe(5);
        expect(mesh.R.zx).toBe(7);

        mesh.release();
        engine.release();
        refChange('stop');
        expect(refChange('dump')).toBe(0);
    });
});
