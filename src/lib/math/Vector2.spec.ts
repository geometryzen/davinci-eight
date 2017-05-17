import { Vector2 } from './Vector2';

describe("Vector2", function () {

    describe("constructor", function () {
        const coords = [Math.random(), Math.random()];
        const v = new Vector2(coords, false);
        it("getComponent(0)", function () {
            expect(v.getComponent(0)).toBe(coords[0]);
        });
        it("getComponent(1)", function () {
            expect(v.getComponent(1)).toBe(coords[1]);
        });
    });

    describe("toString", function () {
        const coords = [2, 3];
        const v = new Vector2(coords, false);
        it("should match coordinates with basis vectors", function () {
            expect(v.toString()).toBe('2*e1+3*e2');
        });
    });

    describe("toFixed", function () {
        const coords = [2, 3];
        const v = new Vector2(coords, false);
        it("should display correct number of decimals", function () {
            expect(v.toFixed(4)).toBe('2.0000*e1+3.0000*e2');
        });
    });

    describe("toExponential", function () {
        const coords = [2, 3];
        const v = new Vector2(coords, false);
        it("should display with scientific notation", function () {
            expect(v.toExponential()).toBe('2e+0*e1+3e+0*e2');
        });
    });
});
