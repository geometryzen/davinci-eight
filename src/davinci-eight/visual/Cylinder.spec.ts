import { Engine } from '../core/Engine';
import { Cylinder } from './Cylinder';

describe("Cylinder", function () {
    it("new-release", function () {
        const engine = new Engine();
        const cylinder = new Cylinder(engine);
        expect(cylinder.isZombie()).toBe(false);
        cylinder.release();
        expect(cylinder.isZombie()).toBe(true);
        engine.release();
    });
});
