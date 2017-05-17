import { Matrix2 } from './Matrix2';

describe("Matrix2", function () {
    describe("elements", function () {
        it("should be a Float32Array to support WebGL", function () {
            const m = new Matrix2(new Float32Array([1, 0, 0, 1]));
            expect(m.elements instanceof Float32Array).toBe(true);
        });
    });
});
