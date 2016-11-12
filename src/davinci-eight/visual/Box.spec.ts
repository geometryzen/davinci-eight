import { Engine } from '../core/Engine';
import { Box } from './Box';

describe('Box', function () {
    it("should be shareable", function () {
        const engine = new Engine();
        const box = new Box(engine);
        expect(box.isZombie()).toBe(false);
        box.release();
        engine.release();
        expect(box.isZombie()).toBe(true);
    });
    it("width should default to 1", function () {
        const engine = new Engine();
        const box = new Box(engine);
        expect(box.width).toBe(1);
        box.release();
        engine.release();
    });
    it("height should default to 1", function () {
        const engine = new Engine();
        const box = new Box(engine);
        expect(box.height).toBe(1);
        box.release();
        engine.release();
    });
    it("depth should default to 1", function () {
        const engine = new Engine();
        const box = new Box(engine);
        expect(box.depth).toBe(1);
        box.release();
        engine.release();
    });
    it("width should be mutable", function () {
        const engine = new Engine();
        const box = new Box(engine);
        box.width = 5;
        expect(box.width).toBe(5);
        expect(box.height).toBe(1);
        expect(box.depth).toBe(1);
        box.release();
        engine.release();
    });
});
