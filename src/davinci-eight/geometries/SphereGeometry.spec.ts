import { Engine } from '../core/Engine';
import SphereGeometryOptions from './SphereGeometryOptions';
import SphereGeometry from './SphereGeometry';
import Spinor3 from '../math/Spinor3';
import Vector3 from '../math/Vector3';

const e2 = Vector3.vector(0, 1, 0);
const e3 = Vector3.vector(0, 0, 1);

describe("SphereGeometry", function () {
    describe("constructor", function () {
        describe("radius property", function () {
            it("should default to unity", function () {
                const engine = new Engine()
                const sphere = new SphereGeometry(engine);
                expect(sphere.radius).toBe(1);
                sphere.release();
                engine.release()
            })
            it("should be mutable", function () {
                const engine = new Engine()
                const sphere = new SphereGeometry(engine);
                sphere.radius = 7;
                expect(sphere.radius).toBe(7);
                sphere.release();
                engine.release()
            })
        })
        describe("getPrincipalScale", function () {
            it("radius", function () {
                const engine = new Engine()
                const sphere = new SphereGeometry(engine);
                expect(sphere.getPrincipalScale('radius')).toBe(1);
                sphere.release();
                engine.release();
            })
        })
        describe("setPrincipalScale", function () {
            it("radius", function () {
                const engine = new Engine()
                const sphere = new SphereGeometry(engine);
                sphere.setPrincipalScale('radius', 2);
                expect(sphere.getPrincipalScale('radius')).toBe(2);
                sphere.release();
                engine.release();
            })
        })
        describe("scaling", function () {
            it("radius", function () {
                const engine = new Engine();
                const sphere = new SphereGeometry(engine);
                const scaling = sphere.scaling;
                expect(scaling.getElement(0, 0)).toBe(1);
                sphere.release();
                engine.release();
            })
            it("radius should be in all diagonal elements", function () {
                const engine = new Engine();
                const options: SphereGeometryOptions = {};
                options.tilt = Spinor3.one();
                const sphere = new SphereGeometry(engine, options);
                sphere.setPrincipalScale('radius', 5);
                const scaling = sphere.scaling;
                expect(scaling.getElement(0, 0)).toBe(5);
                expect(scaling.getElement(1, 1)).toBe(5);
                expect(scaling.getElement(2, 2)).toBe(5);
                sphere.release();
                engine.release();
            })
            it("radius should be in all diagonal elements", function () {
                const engine = new Engine()
                const options: SphereGeometryOptions = {};
                options.tilt = Spinor3.rotorFromDirections(e2, e3);
                const sphere = new SphereGeometry(engine, options);
                sphere.setPrincipalScale('radius', 5);
                const scaling = sphere.scaling;
                expect(scaling.getElement(0, 0)).toBe(5);
                expect(scaling.getElement(1, 1)).toBe(5);
                expect(scaling.getElement(2, 2)).toBe(5);
                sphere.release();
                engine.release();
            })
        })
    })
})
