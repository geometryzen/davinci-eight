import { Engine } from './Engine';
import { IndexBuffer } from './IndexBuffer';
import { refChange } from './refChange';
import { Usage } from './Usage';

describe("IndexBuffer", function () {
    it("should release resources", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        const ibo = new IndexBuffer(engine, new Uint16Array([]), Usage.STATIC_DRAW);
        expect(ibo instanceof IndexBuffer).toBe(true);
        ibo.release();
        engine.release();
        const outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
    });
    it("should be recyclable", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        const ibo = new IndexBuffer(engine, new Uint16Array([]), Usage.STATIC_DRAW);
        expect(ibo instanceof IndexBuffer).toBe(true);
        ibo.release();
        engine.release();
        let outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
        // Here goes...
        refChange('quiet');
        refChange('start');
        ibo.addRef();
        ibo.release();
        outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
    });
});
