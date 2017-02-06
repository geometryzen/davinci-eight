import getViewAttitude from './getViewAttitude';
import Vector3 from '../math/Vector3';
import Spinor3 from '../math/Spinor3';

const zero = Vector3.vector(0, 0, 0);
const e1 = Vector3.vector(1, 0, 0);
const e2 = Vector3.vector(0, 1, 0);
const e3 = Vector3.vector(0, 0, 1);

describe("getViewAttitude", function () {
    it("(eye=e3, look=0, up=e2) should be 1 because it is the reference configuration", function () {
        const eye = e3;
        const look = zero;
        const up = e2;
        const R = Spinor3.zero.clone();
        getViewAttitude(eye, look, up, R);
        expect(R.isOne()).toBeTruthy();
    });
    describe("(eye=e1, look=0, up=e2)", function () {
        const eye = e1;
        const look = zero;
        const up = e2;
        const R = Spinor3.zero.clone();
        getViewAttitude(eye, look, up, R);
        it("should be rotorFromDirections(e3, e1)", function () {
            const rotor = Spinor3.rotorFromDirections(e3, e1);
            expect(R.a).toBeCloseTo(rotor.a, 15);
            expect(R.xy).toBeCloseTo(rotor.xy, 15);
            expect(R.yz).toBeCloseTo(rotor.yz, 15);
            expect(R.zx).toBeCloseTo(rotor.zx, 15);
        });
    });
});
