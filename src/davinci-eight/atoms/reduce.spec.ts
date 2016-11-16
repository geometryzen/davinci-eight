import BeginMode from '../core/BeginMode';
import reduce from './reduce';
import { Vector2 } from '../math/Vector2';
import GridTriangleStrip from './GridTriangleStrip';

function makeGrid(uSegments: number, vSegments: number, uOffset: number, vOffset: number): GridTriangleStrip {
    const grid = new GridTriangleStrip(uSegments, vSegments);
    const iLength = grid.uLength;
    for (let i = 0; i < iLength; i++) {
        const jLength = grid.vLength;
        for (let j = 0; j < jLength; j++) {
            const vertex = grid.vertex(i, j);
            vertex.attributes['uvs'] = new Vector2([i + uOffset, j + vOffset]);
        }
    }
    return grid;
}

describe("reduce", function () {
    describe("two", function () {
        const g1 = makeGrid(1, 1, 0, 0);
        const p1 = g1.toPrimitive();
        const g2 = makeGrid(1, 1, 2, 0);
        const p2 = g2.toPrimitive();
        const compact = reduce([p1, p2]);
        it("should have the correct mode", function () {
            expect(p1.mode).toBe(BeginMode.TRIANGLE_STRIP);
            expect(p2.mode).toBe(BeginMode.TRIANGLE_STRIP);
            expect(compact.mode).toBe(BeginMode.TRIANGLE_STRIP);
        });
        it("should add two degenerate triangles", function () {
            expect(compact.indices.length).toBe(p1.indices.length + 2 + p2.indices.length);
            expect(compact.indices[p1.indices.length - 1]).toBe(compact.indices[p1.indices.length]);
            expect(compact.indices[p1.indices.length + 1]).toBe(compact.indices[p1.indices.length + 2]);
        });
        it("should copy attributes", function () {
            expect(compact.attributes).toBeDefined();
            const uvs = compact.attributes['uvs'];
            expect(uvs).toBeDefined();
        });
    });
    describe("three", function () {
        const g1 = makeGrid(1, 1, 0, 0);
        const p1 = g1.toPrimitive();
        const g2 = makeGrid(1, 1, 2, 0);
        const p2 = g2.toPrimitive();
        const g3 = makeGrid(1, 1, 4, 0);
        const p3 = g3.toPrimitive();
        const compact = reduce([p1, p2, p3]);
        it("should have the correct mode", function () {
            expect(p1.mode).toBe(BeginMode.TRIANGLE_STRIP);
            expect(p2.mode).toBe(BeginMode.TRIANGLE_STRIP);
            expect(compact.mode).toBe(BeginMode.TRIANGLE_STRIP);
        });
        it("should add two degenerate triangles", function () {
            expect(compact.indices.length).toBe(p1.indices.length + 2 + p2.indices.length + 2 + p3.indices.length);
            expect(compact.indices[p1.indices.length - 1]).toBe(compact.indices[p1.indices.length]);
            expect(compact.indices[p1.indices.length + 1]).toBe(compact.indices[p1.indices.length + 2]);
        });
        it("should copy attributes", function () {
            expect(compact.attributes).toBeDefined();
            const uvs = compact.attributes['uvs'];
            expect(uvs).toBeDefined();
        });
    });
});
