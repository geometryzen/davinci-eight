import { Color } from './Color';

const palette: Color[] = [
    // Primary colors
    Color.black,
    Color.blue,
    Color.green,
    Color.cyan,
    Color.red,
    Color.magenta,
    Color.yellow,
    Color.white,
    Color.gray,
    // Fancy colors
    Color.blueviolet,
    Color.chartreuse,
    Color.cobalt,
    Color.hotpink,
    Color.lime,
    Color.slateblue,
    Color.springgreen,
    Color.teal
];

describe("Color", function () {
    describe("constructor", function () {
        it("should set rgb components", function () {
            const r = Math.random();
            const g = Math.random();
            const b = Math.random();
            const color = new Color(r, g, b);
            expect(color.r).toBe(r);
            expect(color.g).toBe(g);
            expect(color.b).toBe(b);
        });
        it("should set red, green, blue components", function () {
            const r = Math.random();
            const g = Math.random();
            const b = Math.random();
            const color = new Color(r, g, b);
            expect(color.red).toBe(r);
            expect(color.green).toBe(g);
            expect(color.blue).toBe(b);
        });
        it("should set not be locked", function () {
            const r = Math.random();
            const g = Math.random();
            const b = Math.random();
            const color = new Color(r, g, b);
            expect(typeof color.isLocked()).toBe('boolean');
            expect(color.isLocked()).toBeFalsy();
        });
    });
    describe("palette", function () {
        it("isLocked", function () {
            palette.forEach((color) => {
                expect(color.isLocked()).toBeTruthy();
            });
        });
    });
    describe("lock()", function () {
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        const color = new Color(r, g, b);
        const token = color.lock();
        it("should return a token", function () {
            expect(color.isLocked()).toBeTruthy();
            expect(typeof token).toBe('number');
        });
        it("should prevent component mutation", function () {
            expect(function () {
                color.r = 1;
            }).toThrow(new Error("target of operation 'set r' must be mutable."));
            expect(function () {
                color.red = 1;
            }).toThrow(new Error("target of operation 'set red' must be mutable."));
            expect(function () {
                color.g = 1;
            }).toThrow(new Error("target of operation 'set g' must be mutable."));
            expect(function () {
                color.green = 1;
            }).toThrow(new Error("target of operation 'set green' must be mutable."));
            expect(function () {
                color.b = 1;
            }).toThrow(new Error("target of operation 'set b' must be mutable."));
            expect(function () {
                color.blue = 1;
            }).toThrow(new Error("target of operation 'set blue' must be mutable."));
        });
        it("should prevent copy", function () {
            expect(function () {
                color.copy(Color.black);
            }).toThrow(new Error("target of operation 'copy' must be mutable."));
        });
    });
    describe("unlock()", function () {
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        const color = new Color(r, g, b);
        const token = color.lock();
        color.unlock(token);
        it("should return a token", function () {
            expect(color.isLocked()).toBeFalsy();
        });
    });
});
