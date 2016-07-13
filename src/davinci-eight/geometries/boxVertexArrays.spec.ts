import BeginMode from '../core/BeginMode';
import BoxGeometryOptions from './BoxGeometryOptions';
import boxVertexArrays from './boxVertexArrays';

describe("boxVertexArrays", function() {
    const options: BoxGeometryOptions = {};
    options.openBack = true;
    options.openFront = false;
    options.openLeft = true;
    options.openRight = true;
    options.openCap = true;
    options.openBase = true;
    const vas = boxVertexArrays(options);
    it("should", function() {
        expect(vas.drawMode).toBe(BeginMode.TRIANGLE_STRIP);
    });
});
