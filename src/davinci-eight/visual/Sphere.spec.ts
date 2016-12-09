import { Engine } from '../core/Engine';
import { Sphere } from './Sphere';
import refChange from '../core/refChange';

describe('Sphere', function () {
    it("should be shareable", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        const sphere = new Sphere(engine);
        expect(sphere.isZombie()).toBe(false);
        sphere.release();
        engine.release();
        expect(sphere.isZombie()).toBe(true);
        refChange('stop');
        const outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
    });
    it("radius should default to 1", function () {
        const engine = new Engine();
        const sphere = new Sphere(engine);
        expect(sphere.radius).toBe(1);
        sphere.release();
        engine.release();
    });
});
