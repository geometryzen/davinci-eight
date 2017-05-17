import { Matrix4 } from './Matrix4';

describe("Matrix4", function () {
    describe("elements", function () {
        it("should be a Float32Array to support WebGL", function () {
            const m = new Matrix4(new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
            expect(m.elements instanceof Float32Array).toBe(true);
            expect(m.getElement(0, 0)).toBe(1);
        });
    });
    describe("isOne", function () {
        it("should be true for Matrix4.one", function () {
            const m = Matrix4.one;
            expect(m.isOne()).toBe(true);
        });
        it("should be false (0, 0)", function () {
            const m = Matrix4.one.clone();
            m.setElement(0, 0, 2);
            expect(m.isOne()).toBe(false);
        });
        it("should be false (1, 1)", function () {
            const m = Matrix4.one.clone();
            m.setElement(1, 1, 0);
            expect(m.isOne()).toBe(false);
        });
    });
});
