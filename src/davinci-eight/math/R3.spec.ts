import { vectorCopy, vectorFromCoords } from './R3';

describe("R3", function () {
    const e1 = vectorFromCoords(1, 0, 0);
    const e2 = vectorFromCoords(0, 1, 0);
    const e3 = vectorFromCoords(0, 0, 1);
    describe("vectorFromCoords", function () {
        const x = Math.random();
        const y = Math.random();
        const z = Math.random();
        const v = vectorFromCoords(x, y, z);
        it("should preserve coordinates", function () {
            expect(v.x).toBe(x);
            expect(v.y).toBe(y);
            expect(v.z).toBe(z);
        });
    });
    describe("vectorCopy", function () {
        const x = Math.random();
        const y = Math.random();
        const z = Math.random();
        const v = vectorCopy({ x, y, z });
        it("should preserve coordinates", function () {
            expect(v.x).toBe(x);
            expect(v.y).toBe(y);
            expect(v.z).toBe(z);
        });
    });
    describe("vectorCopy", function () {
        const x = Math.random();
        const y = Math.random();
        const z = Math.random();
        const v = vectorCopy({ x, y, z });
        it("should preserve coordinates", function () {
            expect(v.x).toBe(x);
            expect(v.y).toBe(y);
            expect(v.z).toBe(z);
        });
    });
    describe("direction", function () {
        const x = Math.random();
        const y = Math.random();
        const z = Math.random();
        const v = vectorCopy({ x, y, z });
        it("(random vector) should be scalar multiple of the random vector", function () {
            const axis = v.direction();
            const magnitude = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
            expect(axis.x).toBe(v.x / magnitude);
            expect(axis.y).toBe(v.y / magnitude);
            expect(axis.z).toBe(v.z / magnitude);
        });
        it("(zero) should be undefined", function () {
            expect(vectorCopy({ x: 0, y: 0, z: 0 }).direction()).toBeUndefined();
        });
    });
    describe("rejectionFrom", function () {
        const x = Math.random();
        const y = Math.random();
        const z = Math.random();
        const v = vectorCopy({ x, y, z });
        it("e1 should preserve y and z-coordinate", function () {
            const perp = v.rejectionFrom(e1);
            expect(perp.x).toBe(0);
            expect(perp.y).toBe(y);
            expect(perp.z).toBe(z);
        });
        it("e2 should preserve x and z-coordinate", function () {
            const perp = v.rejectionFrom(e2);
            expect(perp.x).toBe(x);
            expect(perp.y).toBe(0);
            expect(perp.z).toBe(z);
        });
        it("e3 should preserve x and y-coordinate", function () {
            const perp = v.rejectionFrom(e3);
            expect(perp.x).toBe(x);
            expect(perp.y).toBe(y);
            expect(perp.z).toBe(0);
        });
        it("e1 should preserve y and z-coordinate", function () {
            const perp = v.rejectionFrom(e1.scale(Math.random()));
            expect(perp.x).toBeCloseTo(0, 10);
            expect(perp.y).toBeCloseTo(y, 10);
            expect(perp.z).toBeCloseTo(z, 10);
        });
        it("e2 should preserve x and z-coordinate", function () {
            const perp = v.rejectionFrom(e2.scale(Math.random()));
            expect(perp.x).toBeCloseTo(x, 10);
            expect(perp.y).toBeCloseTo(0, 10);
            expect(perp.z).toBeCloseTo(z, 10);
        });
        it("e3 should preserve x and y-coordinate", function () {
            const perp = v.rejectionFrom(e3.scale(Math.random()));
            expect(perp.x).toBeCloseTo(x, 10);
            expect(perp.y).toBeCloseTo(y, 10);
            expect(perp.z).toBeCloseTo(0, 10);
        });
    });
});
