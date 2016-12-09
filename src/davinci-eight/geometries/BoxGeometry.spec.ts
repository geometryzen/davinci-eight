import { Engine } from '../core/Engine';
import BoxGeometry from './BoxGeometry';
import BoxGeometryOptions from './BoxGeometryOptions';
import Vector3 from '../math/Vector3';
import Spinor3 from '../math/Spinor3';
import refChange from '../core/refChange';

const e1 = Vector3.vector(1, 0, 0);
const e2 = Vector3.vector(0, 1, 0);
const e3 = Vector3.vector(0, 0, 1);

describe("BoxGeometry", function () {
    it("constructor-destructor", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        const options: BoxGeometryOptions = {};
        const geometry = new BoxGeometry(engine, options);
        expect(geometry.scaling.isOne()).toBe(true);
        geometry.release();
        engine.release();
        expect(geometry.isZombie()).toBe(true);
        refChange('stop');
        refChange('dump');
    });

    it("resurrector-destructor", function () {
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine = new Engine();
        const options: BoxGeometryOptions = {};
        const geometry = new BoxGeometry(engine, options);
        expect(geometry.scaling.isOne()).toBe(true);
        geometry.release();
        engine.release();
        refChange('stop');
        refChange('dump');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        expect(geometry.isZombie()).toBe(true);
        geometry.addRef();
        geometry.release();
        refChange('stop');
        refChange('dump');
        refChange('reset');
    });

    describe("scaling", function () {
        it("scaling should be 1 when no tilt supplied", function () {
            const engine = new Engine();
            const options: BoxGeometryOptions = {};
            const geometry = new BoxGeometry(engine, options);
            expect(geometry.scaling.isOne()).toBe(true);
        });
        it("scaling should be 1 when tilt is 1", function () {
            const options: BoxGeometryOptions = {};
            const engine = new Engine();
            const geometry = new BoxGeometry(engine, options);
            expect(geometry.scaling.isOne()).toBe(true);
        });
        it("scaling should coincide with canonical configuration when tilt is 1", function () {
            const engine = new Engine();
            const options: BoxGeometryOptions = {};
            const geometry = new BoxGeometry(engine, options);
            geometry.setPrincipalScale('width', 2);
            geometry.setPrincipalScale('height', 3);
            geometry.setPrincipalScale('depth', 5);
            expect(geometry.scaling.getElement(0, 0)).toBe(2);
            expect(geometry.scaling.getElement(1, 1)).toBe(3);
            expect(geometry.scaling.getElement(2, 2)).toBe(5);
        });
        it("scaling should exchange x and y when rotor is e2 ^ e1", function () {
            const engine = new Engine();
            const options: BoxGeometryOptions = {};
            options.tilt = Spinor3.rotorFromDirections(e2, e1);
            const geometry = new BoxGeometry(engine, options);
            geometry.setPrincipalScale('width', 2);
            geometry.setPrincipalScale('height', 3);
            geometry.setPrincipalScale('depth', 5);
            expect(geometry.scaling.getElement(0, 0)).toBe(3);
            expect(geometry.scaling.getElement(1, 1)).toBe(2);
            expect(geometry.scaling.getElement(2, 2)).toBe(5);
        });
        it("scaling should exchange y and z when rotor is e3 ^ e2", function () {
            const engine = new Engine();
            const options: BoxGeometryOptions = {};
            options.tilt = Spinor3.rotorFromDirections(e3, e2);
            const geometry = new BoxGeometry(engine, options);
            geometry.setPrincipalScale('width', 2);
            geometry.setPrincipalScale('height', 3);
            geometry.setPrincipalScale('depth', 5);
            expect(geometry.scaling.getElement(0, 0)).toBe(2);
            expect(geometry.scaling.getElement(1, 1)).toBe(5);
            expect(geometry.scaling.getElement(2, 2)).toBe(3);
        });
        it("scaling should exchange z and x when rotor is e1 ^ e3", function () {
            const engine = new Engine();
            const options: BoxGeometryOptions = {};
            options.tilt = Spinor3.rotorFromDirections(e1, e3);
            const geometry = new BoxGeometry(engine, options);
            geometry.setPrincipalScale('width', 2);
            geometry.setPrincipalScale('height', 3);
            geometry.setPrincipalScale('depth', 5);
            expect(geometry.scaling.getElement(0, 0)).toBe(5);
            expect(geometry.scaling.getElement(1, 1)).toBe(3);
            expect(geometry.scaling.getElement(2, 2)).toBe(2);
        });
        it("scaling should cycle x -> z -> y -> x when rotor is e1 ^ e2 followed by e2 ^ e3", function () {
            const engine = new Engine();
            const options: BoxGeometryOptions = {};
            const s1 = Spinor3.rotorFromDirections(e1, e2);
            const s2 = Spinor3.rotorFromDirections(e2, e3);
            options.tilt = s2.clone().mul(s1);
            const geometry = new BoxGeometry(engine, options);
            geometry.setPrincipalScale('width', 2);
            geometry.setPrincipalScale('height', 3);
            geometry.setPrincipalScale('depth', 5);
            expect(geometry.scaling.getElement(0, 0)).toBe(3);
            expect(geometry.scaling.getElement(1, 1)).toBe(5);
            expect(geometry.scaling.getElement(2, 2)).toBe(2);
        });
    });
});
