import BeginMode from '../core/BeginMode';
import GridLines from './GridLines';
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive';

describe("GridLines", function () {

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
    describe("(1,1)", function () {
        const gridLines = new GridLines(1, false, 1, false);
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

        const vas = vertexArraysFromPrimitive(gridLines.toPrimitive());
        it("mode should be LINES", function () {
            expect(vas.mode).toBe(BeginMode.LINES);
            expect(vas.indices.length).toBe(8);
            expect(vas.indices[0]).toBe(0);
            expect(vas.indices[1]).toBe(1);
        });
        it("should consist of 4 lines", function () {
            expect(vas.indices.length).toBe(4 * 2);
        });
        it("1st line is from 0 to 1", function () {
            expect(vas.indices[0]).toBe(0);
            expect(vas.indices[1]).toBe(1);
        });
        it("2nd line is from 0 to 2", function () {
            expect(vas.indices[2]).toBe(0);
            expect(vas.indices[3]).toBe(2);
        });
        it("3rd line is from 2 to 3", function () {
            expect(vas.indices[4]).toBe(2);
            expect(vas.indices[5]).toBe(3);
        });
        it("4th line is from 1 to 3", function () {
            expect(vas.indices[6]).toBe(1);
            expect(vas.indices[7]).toBe(3);
        });
    });

});
