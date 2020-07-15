import { Vector4 } from './Vector4';

describe("Vector4", function () {

    describe("constructor", function () {
        const data = [Math.random(), Math.random(), Math.random(), Math.random()];
        const vec = new Vector4(data, false);
        it("getComponent(0)", function () {
            expect(vec.getComponent(0)).toBe(data[0]);
        });
        it("getComponent(1)", function () {
            expect(vec.getComponent(1)).toBe(data[1]);
        });
        it("getComponent(2)", function () {
            expect(vec.getComponent(2)).toBe(data[2]);
        });
        it("getComponent(3)", function () {
            expect(vec.getComponent(3)).toBe(data[3]);
        });
    });

    describe("add", function () {
        const a = new Vector4([Math.random(), Math.random(), Math.random(), Math.random()], false);
        const ax = a.x;
        const ay = a.y;
        const az = a.z;
        const aw = a.w;
        const b = new Vector4([Math.random(), Math.random(), Math.random(), Math.random()], false);
        const bx = b.x;
        const by = b.y;
        const bz = b.z;
        const bw = b.w;
        a.add(b);
        it("add, x component", function () {
            expect(a.x).toBe(ax + bx);
            expect(b.x).toBe(bx);
        });
        it("add, y component", function () {
            expect(a.y).toBe(ay + by);
            expect(b.y).toBe(by);
        });
        it("add, z component", function () {
            expect(a.z).toBe(az + bz);
            expect(b.z).toBe(bz);
        });
        it("add, w component", function () {
            expect(a.w).toBe(aw + bw);
            expect(b.w).toBe(bw);
        });
    });

    describe("a.add2(a, b)", function () {
        const a = new Vector4([Math.random(), Math.random(), Math.random(), Math.random()], false);
        const ax = a.x;
        const ay = a.y;
        const az = a.z;
        const aw = a.w;
        const b = new Vector4([Math.random(), Math.random(), Math.random(), Math.random()], false);
        const bx = b.x;
        const by = b.y;
        const bz = b.z;
        const bw = b.w;
        a.add2(a, b);
        it("add, x component", function () {
            expect(a.x).toBe(ax + bx);
            expect(b.x).toBe(bx);
        });
        it("add, y component", function () {
            expect(a.y).toBe(ay + by);
            expect(b.y).toBe(by);
        });
        it("add, z component", function () {
            expect(a.z).toBe(az + bz);
            expect(b.z).toBe(bz);
        });
        it("add, w component", function () {
            expect(a.w).toBe(aw + bw);
            expect(b.w).toBe(bw);
        });
    });

    describe("a.add2(b, a)", function () {
        const a = new Vector4([Math.random(), Math.random(), Math.random(), Math.random()], false);
        const ax = a.x;
        const ay = a.y;
        const az = a.z;
        const aw = a.w;
        const b = new Vector4([Math.random(), Math.random(), Math.random(), Math.random()], false);
        const bx = b.x;
        const by = b.y;
        const bz = b.z;
        const bw = b.w;
        a.add2(b, a);
        it("add, x component", function () {
            expect(a.x).toBe(ax + bx);
            expect(b.x).toBe(bx);
        });
        it("add, y component", function () {
            expect(a.y).toBe(ay + by);
            expect(b.y).toBe(by);
        });
        it("add, z component", function () {
            expect(a.z).toBe(az + bz);
            expect(b.z).toBe(bz);
        });
        it("add, w component", function () {
            expect(a.w).toBe(aw + bw);
            expect(b.w).toBe(bw);
        });
    });

    describe("copy", function () {
        const a = new Vector4([Math.random(), Math.random(), Math.random(), Math.random()], false);
        const b = new Vector4([Math.random(), Math.random(), Math.random(), Math.random()], false);
        a.copy(b);
        it("add, x component", function () {
            expect(a.x).toBe(b.x);
            expect(b.x).toBe(b.x);
        });
        it("add, y component", function () {
            expect(a.y).toBe(b.y);
            expect(b.y).toBe(b.y);
        });
        it("add, z component", function () {
            expect(a.z).toBe(b.z);
            expect(b.z).toBe(b.z);
        });
        it("add, w component", function () {
            expect(a.w).toBe(b.w);
            expect(b.w).toBe(b.w);
        });
    });

});
