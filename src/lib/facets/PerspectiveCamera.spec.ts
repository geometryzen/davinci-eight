import { PerspectiveCamera } from './PerspectiveCamera';
import { Vector3 } from '../math/Vector3';

const zero = Vector3.vector(0, 0, 0);
const e2 = Vector3.vector(0, 1, 0);
const e3 = Vector3.vector(0, 0, 1);

describe("PerspectiveCamera", function () {
    describe("constructor", function () {
        const camera = new PerspectiveCamera();
        it("aspect = 1", function () {
            expect(camera.aspect).toBe(1);
        });
        it("eye = e3", function () {
            expect(camera.eye.toString()).toBe(e3.toString());
        });
        it("far = 1000", function () {
            expect(camera.far).toBe(1000);
        });
        it("fov = 45 * PI / 180", function () {
            expect(camera.fov).toBe(45 * Math.PI / 180);
        });
        it("look = 0", function () {
            expect(camera.look.toString()).toBe(zero.toString());
        });
        it("near = 0.1", function () {
            expect(camera.near).toBe(0.1);
        });
        it("up = e2", function () {
            expect(camera.up.toString()).toBe(e2.toString());
        });
    });
});
