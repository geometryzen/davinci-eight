import { BeginMode } from './BeginMode';
import { Engine } from './Engine';
import { GeometryElements } from './GeometryElements';
import { Primitive } from './Primitive';
import { refChange } from './refChange';

const primitive: Primitive = {
    mode: BeginMode.POINTS,
    attributes: {
        aPosition: { values: [0, 0, 0], size: 3 }
    },
    indices: [0]
};

describe("GeometryElements", function () {
    it("should release resources", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        expect(engine instanceof Engine).toBe(true);
        const geometry = new GeometryElements(engine, primitive);
        expect(geometry instanceof GeometryElements).toBe(true);
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
        const geometry = new GeometryElements(engine, primitive);
        expect(geometry instanceof GeometryElements).toBe(true);
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
