import { vertexArraysFromPrimitive as f } from './vertexArraysFromPrimitive';
import { Primitive } from './Primitive';
import { BeginMode } from './BeginMode';

describe("vertexArraysFromPrimitive", function () {
    describe("()", function () {
        it("", function () {
            const p: Primitive = {
                mode: BeginMode.POINTS,
                attributes: void 0
            };
            const vas = f(p, []);
            expect(vas).toBeDefined();
            expect(vas.mode).toBe(BeginMode.POINTS);
        });
    });
});
