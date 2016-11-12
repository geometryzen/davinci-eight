import { Engine } from '../core/Engine';
import { Curve } from './Curve';

describe("Curve", function () {
    it("new-release", function () {
        const engine = new Engine();
        const curve = new Curve(engine);
        expect(curve.isZombie()).toBe(false);
        curve.release();
        expect(curve.isZombie()).toBe(true);
        engine.release();
    });
});
