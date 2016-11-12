import { Engine } from '../core/Engine';
import { Grid } from './Grid';

describe("Grid", function () {
    it("new-release", function () {
        const engine = new Engine();
        const grid = new Grid(engine);
        expect(grid.isZombie()).toBe(false);
        grid.release();
        expect(grid.isZombie()).toBe(true);
        engine.release();
    });
});
