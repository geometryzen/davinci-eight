import { Engine } from './Engine';
import { VertexBuffer } from './VertexBuffer';
import { refChange } from './refChange';
import { Usage } from './Usage';

describe("VertexBuffer", function () {
    it("should release resources", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        expect(engine instanceof Engine).toBe(true);
        const vbo = new VertexBuffer(engine, new Float32Array([]), Usage.STATIC_DRAW);
        expect(vbo instanceof VertexBuffer).toBe(true);
        vbo.release();
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
        expect(engine instanceof Engine).toBe(true);
        const vbo = new VertexBuffer(engine, new Float32Array([]), Usage.STATIC_DRAW);
        expect(vbo instanceof VertexBuffer).toBe(true);
        vbo.release();
        engine.release();
        let outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
        // Here goes...
        refChange('quiet');
        refChange('start');
        vbo.addRef();
        vbo.release();
        outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
    });
});
