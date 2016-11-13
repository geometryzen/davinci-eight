import { Engine } from '../core/Engine';
import refChange from '../core/refChange';
import Turtle from './Turtle';

describe("Turtle", function () {
    it("new-release", function () {
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        const turtle = new Turtle(engine);
        expect(turtle.isZombie()).toBe(false);
        turtle.release();
        engine.release();
        expect(turtle.isZombie()).toBe(true);
        refChange('stop');
        const outstanding = refChange('dump');
        expect(outstanding).toBe(0);
    });
});
