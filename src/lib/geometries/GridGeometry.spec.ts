import { Engine } from '../core/Engine';
import { GridGeometry } from './GridGeometry';
import { refChange } from '../core/refChange';

describe("GridGeometry", function () {
    it("new-release", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        const geometry = new GridGeometry(engine);
        expect(geometry.isZombie()).toBe(false);
        geometry.release();
        expect(geometry.isZombie()).toBe(true);
        engine.release();
        refChange('stop');
        const outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
    });
});
