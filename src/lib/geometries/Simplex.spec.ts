import { Simplex } from "./Simplex";
import { SimplexMode } from "./SimplexMode";

describe("Simplex", function () {
    describe("constructor", function () {
        it("should set vertices for an empty simplex", function () {
            const f = new Simplex(SimplexMode.EMPTY);
            expect(f.vertices.length).toBe(0);
        });
        it("should set vertices for 0-simplex", function () {
            const f = new Simplex(SimplexMode.POINT);
            expect(f.vertices.length).toBe(1);
        });
        it("should set vertices for 1-simplex", function () {
            const f = new Simplex(SimplexMode.LINE);
            expect(f.vertices.length).toBe(2);
        });
        it("should set vertices for 2-simplex", function () {
            const f = new Simplex(SimplexMode.TRIANGLE);
            expect(f.vertices.length).toBe(3);
        });
        it("should set vertices for 3-simplex", function () {
            const f = new Simplex(SimplexMode.TETRAHEDRON);
            expect(f.vertices.length).toBe(4);
        });
        it("should set vertices for 4-simplex", function () {
            const f = new Simplex(SimplexMode.FIVE_CELL);
            expect(f.vertices.length).toBe(5);
        });
    });
});
