import createView from './createView';
import { Geometric3 } from '../math/Geometric3';
import Vector3 from '../math/Vector3';

describe("createView", function () {
    describe("() should create a view", function () {
        const view = createView();
        it("should create a view", function () {
            expect(true).toBeTruthy();
            expect(view).toBeDefined();
        });
        // The primary state is eye, look, and up.
        it("should default 'eye' to e3", function () {
            expect(view.eye.equals(Geometric3.vector(0, 0, 1))).toBeTruthy();
            expect(true).toBeTruthy();
        });
        it("should default 'position' to e3", function () {
            expect(Vector3.copy(view.eye).equals(Vector3.vector(0, 0, 1))).toBeTruthy();
            expect(true).toBeTruthy();
        });
        it("should default 'look' to 0", function () {
            expect(view.look.equals(Geometric3.vector(0, 0, 0))).toBeTruthy();
            expect(true).toBeTruthy();
        });
        it("should default 'up' to e2", function () {
            expect(view.up.equals(Geometric3.vector(0, 1, 0))).toBeTruthy();
            expect(true).toBeTruthy();
        });
    });
});
