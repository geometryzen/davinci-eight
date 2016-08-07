import {Grid} from './Grid';

describe("Grid", function() {
    it("new-release", function() {
        const grid = new Grid();
        expect(grid.isZombie()).toBe(false);
        grid.release();
        expect(grid.isZombie()).toBe(true);
    });
});
