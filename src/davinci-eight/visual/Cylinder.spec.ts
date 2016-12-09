import { Engine } from '../core/Engine';
import { Cylinder } from './Cylinder';
import refChange from '../core/refChange';

describe("Cylinder", function () {
    it("new-release", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        const cylinder = new Cylinder(engine);
        expect(cylinder.isZombie()).toBe(false);
        cylinder.release();
        expect(cylinder.isZombie()).toBe(true);
        engine.release();
        refChange('stop');
        const outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
    });
});
