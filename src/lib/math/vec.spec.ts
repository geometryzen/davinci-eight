import { R3 } from './R3';
import { vec } from './R3';

const e1: Readonly<R3> = vec(1, 0, 0);
const e2: Readonly<R3> = vec(0, 1, 0);
const e3: Readonly<R3> = vec(0, 0, 1);

describe("vec", function () {
    describe("e1", function () {
        it("x", function () {
            expect(e1.x).toBe(1);
        });
        it("y", function () {
            expect(e1.y).toBe(0);
        });
        it("z", function () {
            expect(e1.z).toBe(0);
        });
    });
    describe("e2", function () {
        it("x", function () {
            expect(e2.x).toBe(0);
        });
        it("y", function () {
            expect(e2.y).toBe(1);
        });
        it("z", function () {
            expect(e2.z).toBe(0);
        });
    });
    describe("e3", function () {
        it("x", function () {
            expect(e3.x).toBe(0);
        });
        it("y", function () {
            expect(e3.y).toBe(0);
        });
        it("z", function () {
            expect(e3.z).toBe(1);
        });
    });
    describe("add", function () {
        const a = vec(7, 11, 13);
        const b = vec(2, 3, 5);
        const c = a.add(b);
        it("x", function () {
            expect(c.x).toBe(9);
        });
        it("y", function () {
            expect(c.y).toBe(14);
        });
        it("z", function () {
            expect(c.z).toBe(18);
        });
    });
    describe("sub", function () {
        const a = vec(7, 11, 13);
        const b = vec(2, 3, 5);
        const c = a.sub(b);
        it("x", function () {
            expect(c.x).toBe(5);
        });
        it("y", function () {
            expect(c.y).toBe(8);
        });
        it("z", function () {
            expect(c.z).toBe(8);
        });
    });
    describe("cross", function () {
        const a = vec(7, 11, 13);
        const b = vec(2, 3, 5);
        const c = a.cross(b);
        it("x", function () {
            expect(c.x).toBe(16);
        });
        it("y", function () {
            expect(c.y).toBe(-9);
        });
        it("z", function () {
            expect(c.z).toBe(-1);
        });
    });
    describe("direction", function () {
        const a = vec(3, 4, 5);
        const m = Math.sqrt(9 + 16 + 25);
        const c = a.direction();
        it("x", function () {
            expect(c.x).toBe(3 / m);
        });
        it("y", function () {
            expect(c.y).toBe(4 / m);
        });
        it("z", function () {
            expect(c.z).toBe(5 / m);
        });
    });
    describe("scale", function () {
        const a = vec(3, 4, 5);
        const α = 2;
        const c = a.scale(α);
        it("x", function () {
            expect(c.x).toBe(α * a.x);
        });
        it("y", function () {
            expect(c.y).toBe(α * a.y);
        });
        it("z", function () {
            expect(c.z).toBe(α * a.z);
        });
    });
});
