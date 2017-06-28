import { BeginMode } from './BeginMode';
import { Engine } from './Engine';
import { GeometryArrays } from './GeometryArrays';
import { Primitive } from './Primitive';
import { refChange } from './refChange';

const primitive: Primitive = {
    mode: BeginMode.POINTS,
    attributes: {
        aPosition: { values: [0, 0, 0], size: 3 }
    }
};

describe("GeometryArrays", function () {
    it("should release resources", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        expect(engine instanceof Engine).toBe(true);
        const geometry = new GeometryArrays(engine, primitive);
        expect(geometry instanceof GeometryArrays).toBe(true);
        geometry.release();
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
        const geometry = new GeometryArrays(engine, primitive);
        expect(geometry instanceof GeometryArrays).toBe(true);
        geometry.release();
        engine.release();
        let outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
        // Here goes...
        refChange('quiet');
        refChange('start');
        geometry.addRef();
        geometry.release();
        outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
    });
});
