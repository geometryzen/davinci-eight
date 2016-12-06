import GeometryMode from '../geometries/GeometryMode';
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
            expect(modeFromOptions({ k: 0 }, GeometryMode.POINT)).toBe(GeometryMode.POINT);
            expect(modeFromOptions({ k: 0 }, GeometryMode.WIRE)).toBe(GeometryMode.POINT);
            expect(modeFromOptions({ k: 0 }, GeometryMode.MESH)).toBe(GeometryMode.POINT);
        });
        it('1 => LINE', function () {
            expect(modeFromOptions({ k: 1 }, GeometryMode.POINT)).toBe(GeometryMode.WIRE);
            expect(modeFromOptions({ k: 1 }, GeometryMode.WIRE)).toBe(GeometryMode.WIRE);
            expect(modeFromOptions({ k: 1 }, GeometryMode.MESH)).toBe(GeometryMode.WIRE);
        });
        it('2 => TRIANGLE', function () {
            expect(modeFromOptions({ k: 2 }, GeometryMode.POINT)).toBe(GeometryMode.MESH);
            expect(modeFromOptions({ k: 2 }, GeometryMode.POINT)).toBe(GeometryMode.MESH);
            expect(modeFromOptions({ k: 2 }, GeometryMode.POINT)).toBe(GeometryMode.MESH);
            expect(modeFromOptions({ k: 2 }, GeometryMode.POINT)).toBe(GeometryMode.MESH);
        });
    });
    describe("wireFrame", function () {
        it('true should always result in LINE', function () {
            expect(modeFromOptions({ wireFrame: true }, GeometryMode.POINT)).toBe(GeometryMode.WIRE);
            expect(modeFromOptions({ wireFrame: true }, GeometryMode.WIRE)).toBe(GeometryMode.WIRE);
            expect(modeFromOptions({ wireFrame: true }, GeometryMode.MESH)).toBe(GeometryMode.WIRE);
        });
        it('false should fall back to the default', function () {
            expect(modeFromOptions({ wireFrame: false }, GeometryMode.POINT)).toBe(GeometryMode.POINT);
            expect(modeFromOptions({ wireFrame: false }, GeometryMode.WIRE)).toBe(GeometryMode.WIRE);
            expect(modeFromOptions({ wireFrame: false }, GeometryMode.MESH)).toBe(GeometryMode.MESH);
        });
        it('undefined should fall back to the default', function () {
            expect(modeFromOptions({ wireFrame: void 0 }, GeometryMode.POINT)).toBe(GeometryMode.POINT);
            expect(modeFromOptions({ wireFrame: void 0 }, GeometryMode.WIRE)).toBe(GeometryMode.WIRE);
            expect(modeFromOptions({ wireFrame: void 0 }, GeometryMode.MESH)).toBe(GeometryMode.MESH);
        });
    });
});
