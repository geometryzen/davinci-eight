import { Engine } from '../core/Engine';
import { Curve } from './Curve';
import { refChange } from '../core/refChange';

describe("Curve", function () {
    it("new-release", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        const curve = new Curve(engine);
        expect(curve.isZombie()).toBe(false);
        curve.release();
        expect(curve.isZombie()).toBe(true);
        engine.release();
        refChange('stop');
        const outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
    });
});
