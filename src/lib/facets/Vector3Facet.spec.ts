import { Vector3Facet } from './Vector3Facet';

describe("Vector3Facet", function () {
    describe("constructor", function () {
        const S = new Vector3Facet('S');
        it("defaults", function () {
            expect(S.name).toBe('S');
            expect(S.value.x).toBe(0);
            expect(S.value.y).toBe(0);
            expect(S.value.z).toBe(0);
            expect(S.vector.x).toBe(0);
            expect(S.vector.y).toBe(0);
            expect(S.vector.z).toBe(0);
        });
    });
    describe("mutation", function () {
        const X = new Vector3Facet('');
        X.name = 'X';
        X.value = { x: 1, y: 2, z: 3 };
        it("changes", function () {
            expect(X.name).toBe('X');
            expect(X.value.x).toBe(1);
            expect(X.value.y).toBe(2);
            expect(X.value.z).toBe(3);
            expect(X.vector.x).toBe(1);
            expect(X.vector.y).toBe(2);
            expect(X.vector.z).toBe(3);
        });
    });
});
