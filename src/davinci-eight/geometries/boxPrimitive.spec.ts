import BeginMode from '../core/BeginMode';
import BoxGeometryOptions from './BoxGeometryOptions';
import boxPrimitive from './boxPrimitive';

describe("boxVertexArrays", function() {
    const options: BoxGeometryOptions = {};
    options.openBack = false;
    options.openFront = false;
    options.openLeft = true;
    options.openRight = true;
    options.openCap = true;
    options.openBase = true;
    const primitive = boxPrimitive(options);
    it("should", function() {
        expect(primitive.mode).toBe(BeginMode.TRIANGLE_STRIP);
    });
});
