import GeometryMode from '../geometries/GeometryMode';
import SimplexMode from '../geometries/SimplexMode';
import modeFromOptions from './geometryModeFromOptions';

describe('modeFromOptions', function () {
    describe("for common case of", function () {
        it('default', function () {
            expect(modeFromOptions(void 0, GeometryMode.POINT)).toBe(GeometryMode.POINT);
            expect(modeFromOptions(void 0, GeometryMode.WIRE)).toBe(GeometryMode.WIRE);
            expect(modeFromOptions(void 0, GeometryMode.MESH)).toBe(GeometryMode.MESH);
        });
        it('missing', function () {
            expect(modeFromOptions({}, GeometryMode.MESH)).toBe(GeometryMode.MESH);
        });
    });
    describe("mode", function () {
        it('POINT', function () {
            expect(modeFromOptions({ mode: GeometryMode.POINT }, GeometryMode.POINT)).toBe(GeometryMode.POINT);
        });
        it('WIRE', function () {
            expect(modeFromOptions({ mode: GeometryMode.WIRE }, GeometryMode.POINT)).toBe(GeometryMode.WIRE);
        });
        it('MESH', function () {
            expect(modeFromOptions({ mode: GeometryMode.MESH }, GeometryMode.POINT)).toBe(GeometryMode.MESH);
        });
    });
    describe("k", function () {
        it('0 => POINT', function () {
            expect(modeFromOptions({ k: SimplexMode.POINT }, GeometryMode.POINT, true)).toBe(GeometryMode.POINT);
            expect(modeFromOptions({ k: SimplexMode.POINT }, GeometryMode.WIRE, true)).toBe(GeometryMode.POINT);
            expect(modeFromOptions({ k: SimplexMode.POINT }, GeometryMode.MESH, true)).toBe(GeometryMode.POINT);
        });
        it('1 => LINE', function () {
            expect(modeFromOptions({ k: SimplexMode.LINE }, GeometryMode.POINT, true)).toBe(GeometryMode.WIRE);
            expect(modeFromOptions({ k: SimplexMode.LINE }, GeometryMode.WIRE, true)).toBe(GeometryMode.WIRE);
            expect(modeFromOptions({ k: SimplexMode.LINE }, GeometryMode.MESH, true)).toBe(GeometryMode.WIRE);
        });
        it('2 => TRIANGLE', function () {
            expect(modeFromOptions({ k: SimplexMode.TRIANGLE }, GeometryMode.POINT, true)).toBe(GeometryMode.MESH);
            expect(modeFromOptions({ k: SimplexMode.TRIANGLE }, GeometryMode.POINT, true)).toBe(GeometryMode.MESH);
            expect(modeFromOptions({ k: SimplexMode.TRIANGLE }, GeometryMode.POINT, true)).toBe(GeometryMode.MESH);
            expect(modeFromOptions({ k: SimplexMode.TRIANGLE }, GeometryMode.POINT, true)).toBe(GeometryMode.MESH);
        });
    });
    describe("wireFrame", function () {
        it('true should always result in LINE', function () {
            expect(modeFromOptions({ wireFrame: true }, GeometryMode.POINT, true)).toBe(GeometryMode.WIRE);
            expect(modeFromOptions({ wireFrame: true }, GeometryMode.WIRE, true)).toBe(GeometryMode.WIRE);
            expect(modeFromOptions({ wireFrame: true }, GeometryMode.MESH, true)).toBe(GeometryMode.WIRE);
        });
        it('false should fall back to the default', function () {
            expect(modeFromOptions({ wireFrame: false }, GeometryMode.POINT, true)).toBe(GeometryMode.POINT);
            expect(modeFromOptions({ wireFrame: false }, GeometryMode.WIRE, true)).toBe(GeometryMode.WIRE);
            expect(modeFromOptions({ wireFrame: false }, GeometryMode.MESH, true)).toBe(GeometryMode.MESH);
        });
        it('undefined should fall back to the default', function () {
            expect(modeFromOptions({ wireFrame: void 0 }, GeometryMode.POINT, true)).toBe(GeometryMode.POINT);
            expect(modeFromOptions({ wireFrame: void 0 }, GeometryMode.WIRE, true)).toBe(GeometryMode.WIRE);
            expect(modeFromOptions({ wireFrame: void 0 }, GeometryMode.MESH, true)).toBe(GeometryMode.MESH);
        });
    });
});
