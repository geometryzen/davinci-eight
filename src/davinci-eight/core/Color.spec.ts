import { Color } from './Color';

describe("Color", function () {
    it("black", function () {
        const color = new Color(0, 0, 0);
        expect(color.r).toBe(0);
        expect(color.g).toBe(0);
        expect(color.b).toBe(0);
    });
    it("red", function () {
        const color = new Color(1, 0, 0);
        expect(color.r).toBe(1);
        expect(color.g).toBe(0);
        expect(color.b).toBe(0);
    });
    it("green", function () {
        const color = new Color(0, 1, 0);
        expect(color.r).toBe(0);
        expect(color.g).toBe(1);
        expect(color.b).toBe(0);
    });
    it("blue", function () {
        const color = new Color(0, 0, 1);
        expect(color.r).toBe(0);
        expect(color.g).toBe(0);
        expect(color.b).toBe(1);
    });
});
