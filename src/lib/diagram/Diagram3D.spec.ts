import { vectorFromCoords } from "../math/R3";
import { view, perspective } from "./Diagram3D";

const e1 = vectorFromCoords(1, 0, 0);
const e2 = vectorFromCoords(0, 1, 0);
const e3 = vectorFromCoords(0, 0, 1);
const zero = vectorFromCoords(0, 0, 0);

describe("Diagram3D", function () {
    describe("view", function () {
        it("origin from +e3 with up e2 should be <0,0,-1>", function () {
            const X = zero;
            const eye = e3;
            const look = zero;
            const up = e2;
            const v = view(X, eye, look, up);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(-1);
        });
        it("origin from -e3 with up e2 should be <0,0,-1>", function () {
            const X = zero;
            const eye = e3.scale(-1);
            const look = zero;
            const up = e2;
            const v = view(X, eye, look, up);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(-1);
        });
        it("origin from +e1 with up e2 should be <0,0,-1>", function () {
            const X = zero;
            const eye = e1;
            const look = zero;
            const up = e2;
            const v = view(X, eye, look, up);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(-1);
        });
        it("origin from -e1 with up e2 should be <0,0,-1>", function () {
            const X = zero;
            const eye = e1.scale(-1);
            const look = zero;
            const up = e2;
            const v = view(X, eye, look, up);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(-1);
        });
        it("random from e3 with up e2 should be...", function () {
            const X = vectorFromCoords(Math.random(), Math.random(), Math.random());
            const eye = e3;
            const look = zero;
            const up = e2;
            const v = view(X, eye, look, up);
            const XminusEye = X.sub(eye);
            const u1 = XminusEye.dot(e1);
            const u2 = XminusEye.dot(e2);
            const u3 = XminusEye.dot(e3);
            expect(v.x).toBe(u1);
            expect(v.y).toBe(u2);
            expect(v.z).toBe(u3);
        });
    });
    describe("perspective", function () {
        it("vertex mapping to (+1,+1,-1)", function () {
            const N = 1;
            const F = 1000;
            const fov = Math.PI / 4;
            const aspect = 2;
            const u = 2 * N * Math.tan(fov / 2);
            const v = N * Math.tan(fov / 2);
            const w = -N;
            const X = e3.scale(w).add(e1.scale(u)).add(e2.scale(v));
            const image = perspective(X, N, F, fov, aspect);
            expect(image.x).toBe(+1);
            expect(image.y).toBe(+1);
            expect(image.z).toBe(-1);
        });
        it("vertex mapping to (+1,-1,-1)", function () {
            const N = 1;
            const F = 1000;
            const fov = Math.PI / 4;
            const aspect = 2;
            const u = +2 * N * Math.tan(fov / 2);
            const v = -N * Math.tan(fov / 2);
            const w = -N;
            const X = e3.scale(w).add(e1.scale(u)).add(e2.scale(v));
            const image = perspective(X, N, F, fov, aspect);
            expect(image.x).toBe(+1);
            expect(image.y).toBe(-1);
            expect(image.z).toBe(-1);
        });
        it("vertex mapping to (-1,-1,-1)", function () {
            const N = 1;
            const F = 1000;
            const fov = Math.PI / 4;
            const aspect = 2;
            const u = -2 * N * Math.tan(fov / 2);
            const v = -N * Math.tan(fov / 2);
            const w = -N;
            const X = e3.scale(w).add(e1.scale(u)).add(e2.scale(v));
            const image = perspective(X, N, F, fov, aspect);
            expect(image.x).toBe(-1);
            expect(image.y).toBe(-1);
            expect(image.z).toBe(-1);
        });
        it("vertex mapping to (-1,+1,-1)", function () {
            const N = 1;
            const F = 1000;
            const fov = Math.PI / 4;
            const aspect = 2;
            const u = -2 * N * Math.tan(fov / 2);
            const v = +N * Math.tan(fov / 2);
            const w = -N;
            const X = e3.scale(w).add(e1.scale(u)).add(e2.scale(v));
            const image = perspective(X, N, F, fov, aspect);
            expect(image.x).toBe(-1);
            expect(image.y).toBe(+1);
            expect(image.z).toBe(-1);
        });
        it("vertex mapping to (+1,+1,+1)", function () {
            const N = 1;
            const F = 1000;
            const fov = Math.PI / 4;
            const aspect = 2;
            const u = 2 * F * Math.tan(fov / 2);
            const v = F * Math.tan(fov / 2);
            const w = -F;
            const X = e3.scale(w).add(e1.scale(u)).add(e2.scale(v));
            const image = perspective(X, N, F, fov, aspect);
            expect(image.x).toBe(+1);
            expect(image.y).toBe(+1);
            expect(image.z).toBe(+1);
        });
        it("vertex mapping to (+1,-1,+1)", function () {
            const N = 1;
            const F = 1000;
            const fov = Math.PI / 4;
            const aspect = 2;
            const u = 2 * F * Math.tan(fov / 2);
            const v = -F * Math.tan(fov / 2);
            const w = -F;
            const X = e3.scale(w).add(e1.scale(u)).add(e2.scale(v));
            const image = perspective(X, N, F, fov, aspect);
            expect(image.x).toBe(+1);
            expect(image.y).toBe(-1);
            expect(image.z).toBe(+1);
        });
        it("vertex mapping to (-1,-1,+1)", function () {
            const N = 1;
            const F = 1000;
            const fov = Math.PI / 4;
            const aspect = 2;
            const u = -2 * F * Math.tan(fov / 2);
            const v = -F * Math.tan(fov / 2);
            const w = -F;
            const X = e3.scale(w).add(e1.scale(u)).add(e2.scale(v));
            const image = perspective(X, N, F, fov, aspect);
            expect(image.x).toBe(-1);
            expect(image.y).toBe(-1);
            expect(image.z).toBe(+1);
        });
        it("vertex mapping to (-1,+1,+1)", function () {
            const N = 1;
            const F = 1000;
            const fov = Math.PI / 4;
            const aspect = 2;
            const u = -2 * F * Math.tan(fov / 2);
            const v = +F * Math.tan(fov / 2);
            const w = -F;
            const X = e3.scale(w).add(e1.scale(u)).add(e2.scale(v));
            const image = perspective(X, N, F, fov, aspect);
            expect(image.x).toBe(-1);
            expect(image.y).toBe(+1);
            expect(image.z).toBe(+1);
        });
    });
});
