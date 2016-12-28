import ViewTransform from './ViewTransform';

describe("ViewTransform", function () {
    describe("constructor", function () {
        const V = new ViewTransform();
        it("should set eye to e3", function () {
            expect(V.eye.x).toBe(0);
            expect(V.eye.y).toBe(0);
            expect(V.eye.z).toBe(1);
        });
        it("should set look to zero", function () {
            expect(V.look.x).toBe(0);
            expect(V.look.y).toBe(0);
            expect(V.look.z).toBe(0);
        });
        it("should set up to e2", function () {
            expect(V.up.x).toBe(0);
            expect(V.up.y).toBe(1);
            expect(V.up.z).toBe(0);
        });
    });
});
