import BeginMode from '../core/BeginMode';
import GridPoints from './GridPoints';

describe("GridPoints", function () {
    //
    // A single point is not so trivial.
    //
    describe("(0, 0)", function () {
        const gridLines = new GridPoints(0, false, 0, false);
        it("should have the correct length and segment properties", function () {
            expect(gridLines.uSegments).toBe(0);
            expect(gridLines.uLength).toBe(1);
            expect(gridLines.vSegments).toBe(0);
            expect(gridLines.vLength).toBe(1);
        });
        it("vertex(0, 0) should have the correct vertex labels", function () {
            expect(gridLines.vertex(0, 0).coords.length).toBe(2);
            expect(gridLines.vertex(0, 0).coords.getComponent(0)).toBe(0);
            expect(gridLines.vertex(0, 0).coords.getComponent(1)).toBe(0);
        });
        const vas = gridLines.toVertexArrays();
        it("mode should be POINTS", function () {
            expect(vas.mode).toBe(BeginMode.POINTS);
        });
        it("should consist of 1 points", function () {
            expect(vas.indices.length).toBe(1);
        });
        it("that point is 0", function () {
            expect(vas.indices[0]).toBe(0);
        });
    });

    // TODO: It would be nice to simply specify:
    // 1) There must be four unique lines
    // 2) Every inner vertex is conected by four lines to its nearest neighbor.
    // 3) Edge vertices are connected 3 lines
    // 4) Corner vertices are connected with 2 lines.
    /**
     * 2---3
     * |   |
     * 0---1
     */
    describe("(1, 1)", function () {
        const gridLines = new GridPoints(1, false, 1, false);
        it("should have the correct length and segment properties", function () {
            expect(gridLines.uSegments).toBe(1);
            expect(gridLines.uLength).toBe(2);
            expect(gridLines.vSegments).toBe(1);
            expect(gridLines.vLength).toBe(2);
        });

        it("vertex(0, 0) should have the correct vertex labels", function () {
            expect(gridLines.vertex(0, 0).coords.length).toBe(2);
            expect(gridLines.vertex(0, 0).coords.getComponent(0)).toBe(0);
            expect(gridLines.vertex(0, 0).coords.getComponent(1)).toBe(0);
        });
        it("vertex(1, 0) should have the correct vertex labels", function () {
            expect(gridLines.vertex(1, 0).coords.length).toBe(2);
            expect(gridLines.vertex(1, 0).coords.getComponent(0)).toBe(1);
            expect(gridLines.vertex(1, 0).coords.getComponent(1)).toBe(0);
        });
        it("vertex(0, 1) should have the correct vertex labels", function () {
            expect(gridLines.vertex(0, 1).coords.length).toBe(2);
            expect(gridLines.vertex(0, 1).coords.getComponent(0)).toBe(0);
            expect(gridLines.vertex(0, 1).coords.getComponent(1)).toBe(1);
        });
        it("vertex(1, 1) should have the correct vertex labels", function () {
            expect(gridLines.vertex(1, 1).coords.length).toBe(2);
            expect(gridLines.vertex(1, 1).coords.getComponent(0)).toBe(1);
            expect(gridLines.vertex(1, 1).coords.getComponent(1)).toBe(1);
        });

        const vas = gridLines.toVertexArrays();
        it("mode should be POINTS", function () {
            expect(vas.mode).toBe(BeginMode.POINTS);
        });
        it("should consist of 4 points", function () {
            expect(vas.indices.length).toBe(4 * 1);
        });
        it("1st point is 0", function () {
            expect(vas.indices[0]).toBe(0);
        });
        it("2nd point is 2", function () {
            expect(vas.indices[1]).toBe(2);
        });
        it("3rd point is 1", function () {
            expect(vas.indices[2]).toBe(1);
        });
        it("4th point is 3", function () {
            expect(vas.indices[3]).toBe(3);
        });
    });

});
