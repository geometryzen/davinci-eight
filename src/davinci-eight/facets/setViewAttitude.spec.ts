import { Geometric3 } from '../math/Geometric3';
import Vector3 from '../math/Vector3';
import setViewAttitude from './setViewAttitude';
import Spinor3 from '../math/Spinor3';

const zero = Vector3.vector(0, 0, 0);
const e1 = Vector3.vector(1, 0, 0);
const e2 = Vector3.vector(0, 1, 0);
const e3 = Vector3.vector(0, 0, 1);

describe("setViewAttitude", function () {
    describe("(1, eye=e3, look=0, up=e2)", function () {
        const R = Spinor3.one();
        const eye = Geometric3.fromVector(e3);
        const look = Geometric3.fromVector(zero);
        const lookOriginal = look.clone();
        const up = Geometric3.fromVector(e2);
        const upOriginal = up.clone();

        setViewAttitude(R, eye, look, up);

        it("should set eye to e3", function () {
            expect(eye.toString()).toBe(e3.toString());
        });
        it("should leave look unchanged", function () {
            expect(look.toString()).toBe(lookOriginal.toString());
        });
        it("should leave up unchanged", function () {
            expect(up.toString()).toBe(upOriginal.toString());
        });
    });
    describe("(rotorFromDirections(e3, e1), eye=e3, look=0, up=e2)", function () {
        const R = Spinor3.rotorFromDirections(e3, e1);
        const eye = Geometric3.fromVector(e3);
        const look = Geometric3.fromVector(zero);
        const lookOriginal = look.clone();
        const up = Geometric3.fromVector(e2);
        const upOriginal = up.clone();

        setViewAttitude(R, eye, look, up);

        it("should set eye to e1", function () {
            expect(eye.distanceTo(e1)).toBeCloseTo(0, 15);
            expect(eye.normalize().toString()).toBe(e1.toString());
        });
        it("should leave look unchanged", function () {
            expect(look.toString()).toBe(lookOriginal.toString());
        });
        it("should leave up unchanged", function () {
            expect(up.toString()).toBe(upOriginal.toString());
        });
    });
});
