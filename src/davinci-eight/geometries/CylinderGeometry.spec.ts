import { Engine } from '../core/Engine';
import CylinderGeometry from './CylinderGeometry'
import CylinderGeometryOptions from './CylinderGeometryOptions'
import Vector3 from '../math/Vector3'
import Spinor3 from '../math/Spinor3'

const e1 = Vector3.vector(1, 0, 0);
const e2 = Vector3.vector(0, 1, 0);
const e3 = Vector3.vector(0, 0, 1);

describe("CylinderGeometry", function () {
    describe("constructor", function () {
        describe("radius property", function () {
            it("should default to unity", function () {
                const engine = new Engine()
                const cylinder = new CylinderGeometry(engine)
                expect(cylinder.radius).toBe(1)
                cylinder.release()
                engine.release()
            })
            it("should be mutable", function () {
                const engine = new Engine()
                const cylinder = new CylinderGeometry(engine)
                cylinder.radius = 7
                expect(cylinder.radius).toBe(7)
                cylinder.release()
                engine.release()
            })
            it("should be orthogonal to length", function () {
                const engine = new Engine()
                const cylinder = new CylinderGeometry(engine)
                cylinder.radius = 7
                expect(cylinder.radius).toBe(7)
                expect(cylinder.length).toBe(1)
                cylinder.release()
                engine.release()
            })
        })
        describe("length property", function () {
            it("should default to unity", function () {
                const engine = new Engine()
                const cylinder = new CylinderGeometry(engine)
                expect(cylinder.length).toBe(1)
                cylinder.release()
                engine.release()
            })
            it("should be mutable", function () {
                const engine = new Engine();
                const cylinder = new CylinderGeometry(engine)
                cylinder.length = 7
                expect(cylinder.length).toBe(7)
                cylinder.release()
                engine.release()
            })
            it("should be orthogonal to radius", function () {
                const engine = new Engine()
                const cylinder = new CylinderGeometry(engine)
                cylinder.length = 7
                expect(cylinder.radius).toBe(1)
                expect(cylinder.length).toBe(7)
                cylinder.release()
                engine.release()
            })
        })
        describe("getPrincipalScale", function () {
            it("radius", function () {
                const engine = new Engine()
                const cylinder = new CylinderGeometry(engine)
                expect(cylinder.getPrincipalScale('radius')).toBe(1)
                cylinder.release()
                engine.release()
            })
        })
        describe("setPrincipalScale", function () {
            it("radius", function () {
                const engine = new Engine()
                const cylinder = new CylinderGeometry(engine)
                cylinder.setPrincipalScale('radius', 2)
                expect(cylinder.getPrincipalScale('radius')).toBe(2)
                cylinder.release()
                engine.release()
            })
        })
        describe("scaling", function () {
            it("radius", function () {
                const engine = new Engine()
                const cylinder = new CylinderGeometry(engine)
                const scaling = cylinder.scaling
                expect(scaling.getElement(0, 0)).toBe(1)
                cylinder.release()
                engine.release()
            })
            it("radius in x,z, length in y in canonical configuration", function () {
                const engine = new Engine()
                const options: CylinderGeometryOptions = {}
                options.tilt = Spinor3.one()
                const cylinder = new CylinderGeometry(engine, options)
                cylinder.radius = 5
                cylinder.length = 7
                const scaling = cylinder.scaling
                expect(scaling.getElement(0, 0)).toBe(5)
                expect(scaling.getElement(1, 1)).toBe(7)
                expect(scaling.getElement(2, 2)).toBe(5)
                cylinder.release()
                engine.release()
            })
            it("radius in x,y, length in z after rotation from e2 to e3", function () {
                const engine = new Engine()
                const options: CylinderGeometryOptions = {}
                options.tilt = Spinor3.rotorFromDirections(e2, e3)
                const cylinder = new CylinderGeometry(engine, options)
                cylinder.radius = 5
                cylinder.length = 7
                const scaling = cylinder.scaling
                expect(scaling.getElement(0, 0)).toBe(5)
                expect(scaling.getElement(1, 1)).toBe(5)
                expect(scaling.getElement(2, 2)).toBe(7)
                cylinder.release()
                engine.release()
            })
            it("radius in z,y, length in x after rotation from e2 to e1", function () {
                const engine = new Engine()
                const options: CylinderGeometryOptions = {}
                options.tilt = Spinor3.rotorFromDirections(e2, e1)
                const cylinder = new CylinderGeometry(engine, options)
                cylinder.radius = 5
                cylinder.length = 7
                const scaling = cylinder.scaling
                expect(scaling.getElement(0, 0)).toBe(7)
                expect(scaling.getElement(1, 1)).toBe(5)
                expect(scaling.getElement(2, 2)).toBe(5)
                cylinder.release()
                engine.release()
            })
        })
    })
})
