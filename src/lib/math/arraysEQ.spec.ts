import { arraysEQ } from "./arraysEQ";

describe("arraysEQ", function () {
    it("should require lengths to be equal", function () {
        expect(arraysEQ([1], [1])).toBe(true);
        expect(arraysEQ([], [1])).toBe(false);
    });
    it("should require elements to be equal", function () {
        expect(arraysEQ([1], [1])).toBe(true);
        expect(arraysEQ<number | string>([1], ["1"])).toBe(false);
    });
    //
    // Combinations of [], null, and undefined.
    // There will be 9 = 3 x 3 of them.
    //
    // 1
    it("(undefined, undefined) => true", function () {
        expect(arraysEQ(void 0, void 0)).toBe(true);
    });
    // 2
    it("(undefined, []) => false", function () {
        expect(arraysEQ(void 0, [])).toBe(false);
    });
    // 3
    it("([], undefined) => false", function () {
        expect(arraysEQ([], void 0)).toBe(false);
    });
    // 4
    it("([], []) => true", function () {
        expect(arraysEQ([], [])).toBe(true);
    });
    // 5
    it("(null, null) => true", function () {
        expect(arraysEQ(null, null)).toBe(true);
    });
    // 6
    it("(null, []) => false", function () {
        expect(arraysEQ(null, [])).toBe(false);
    });
    // 7
    it("([], null) => false", function () {
        expect(arraysEQ([], null)).toBe(false);
    });
    // 8
    it("(null, undefined) => false", function () {
        expect(arraysEQ(null, void 0)).toBe(false);
    });
    // 9
    it("(undefined, null) => false", function () {
        expect(arraysEQ(void 0, null)).toBe(false);
    });
});
