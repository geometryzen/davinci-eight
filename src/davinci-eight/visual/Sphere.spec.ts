import { Engine } from '../core/Engine';
import { Sphere } from './Sphere';

describe('Sphere', function () {
    it("should be shareable", function () {
        const engine = new Engine();
        const sphere = new Sphere(engine);
        expect(sphere.isZombie()).toBe(false);
        sphere.release();
        engine.release();
        expect(sphere.isZombie()).toBe(true);
    });
    it("radius should default to 1", function () {
        const engine = new Engine();
        const sphere = new Sphere(engine);
        expect(sphere.radius).toBe(1);
        sphere.release();
        engine.release();
    });
});
