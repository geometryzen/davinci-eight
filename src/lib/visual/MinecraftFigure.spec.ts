import { Engine } from '../core/Engine';
import { MinecraftFigure } from './MinecraftFigure';
import { refChange } from '../core/refChange';

describe("MinecraftFigure", function () {
    it("new-release", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        const figure = new MinecraftFigure(engine, void 0);
        expect(figure.isZombie()).toBe(false);
        figure.release();
        expect(figure.isZombie()).toBe(true);
        engine.release();
        refChange('stop');
        const outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
    });
});
