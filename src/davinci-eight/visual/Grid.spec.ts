import { Engine } from '../core/Engine';
import { Grid } from './Grid';
import refChange from '../core/refChange';

describe("Grid", function () {
    it("new-release", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        const grid = new Grid(engine);
        expect(grid.isZombie()).toBe(false);
        grid.release();
        expect(grid.isZombie()).toBe(true);
        engine.release();
        refChange('stop');
        const outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
    });
});
