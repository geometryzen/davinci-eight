import Matrix2 from './Matrix2';
import Vector1 from './Vector1';

describe("Matrix2", function () {
    describe("elements", function () {
        it("should be a Float32Array to support WebGL", function () {
            const m = new Matrix2(new Float32Array([1, 0, 0, 1]));
            expect(m.elements instanceof Float32Array).toBe(true);
        });
    });
    describe("translation", function () {
        xit("", function () {
            const a = Vector1.random();
            const T = Matrix2.one().translation(a);
            expect(T.getElement(0, 0)).toBe(1);
            expect(T.getElement(0, 1)).toBe(a.x);
            expect(T.getElement(1, 0)).toBe(0);
            expect(T.getElement(1, 1)).toBe(1);
            // const x = Vector1.zero()
            // const result = x.clone().applyMatrix(T)
            // const displacement = result.clone().sub(x)
        });
    });
});
