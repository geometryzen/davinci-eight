import { GeometryMode } from '../geometries/GeometryMode';
import { SimplexMode } from '../geometries/SimplexMode';
import { simplexModeFromOptions as modeFromOptions } from './simplexModeFromOptions';

describe('modeFromOptions', function () {
    describe("for common case of", function () {
        it('default', function () {
            expect(modeFromOptions(void 0, SimplexMode.POINT)).toBe(SimplexMode.POINT);
            expect(modeFromOptions(void 0, SimplexMode.LINE)).toBe(SimplexMode.LINE);
            expect(modeFromOptions(void 0, SimplexMode.TRIANGLE)).toBe(SimplexMode.TRIANGLE);
        });
        it('missing', function () {
            expect(modeFromOptions({}, SimplexMode.TRIANGLE)).toBe(SimplexMode.TRIANGLE);
        });
    });
    describe("mode", function () {
        it('POINT', function () {
            expect(modeFromOptions({ mode: GeometryMode.POINT }, SimplexMode.POINT)).toBe(SimplexMode.POINT);
        });
        it('WIRE', function () {
            expect(modeFromOptions({ mode: GeometryMode.WIRE }, SimplexMode.POINT)).toBe(SimplexMode.LINE);
        });
        it('MESH', function () {
            expect(modeFromOptions({ mode: GeometryMode.MESH }, SimplexMode.POINT)).toBe(SimplexMode.TRIANGLE);
        });
    });
    describe("k", function () {
        it('-1 => EMPTY', function () {
            expect(modeFromOptions({ k: -1 }, SimplexMode.EMPTY)).toBe(SimplexMode.EMPTY);
            expect(modeFromOptions({ k: -1 }, SimplexMode.POINT)).toBe(SimplexMode.EMPTY);
            expect(modeFromOptions({ k: -1 }, SimplexMode.LINE)).toBe(SimplexMode.EMPTY);
            expect(modeFromOptions({ k: -1 }, SimplexMode.TRIANGLE)).toBe(SimplexMode.EMPTY);
        });
        it('0 => POINT', function () {
            expect(modeFromOptions({ k: 0 }, SimplexMode.EMPTY)).toBe(SimplexMode.POINT);
            expect(modeFromOptions({ k: 0 }, SimplexMode.POINT)).toBe(SimplexMode.POINT);
            expect(modeFromOptions({ k: 0 }, SimplexMode.LINE)).toBe(SimplexMode.POINT);
            expect(modeFromOptions({ k: 0 }, SimplexMode.TRIANGLE)).toBe(SimplexMode.POINT);
        });
        it('1 => LINE', function () {
            expect(modeFromOptions({ k: 1 }, SimplexMode.EMPTY)).toBe(SimplexMode.LINE);
            expect(modeFromOptions({ k: 1 }, SimplexMode.POINT)).toBe(SimplexMode.LINE);
            expect(modeFromOptions({ k: 1 }, SimplexMode.LINE)).toBe(SimplexMode.LINE);
            expect(modeFromOptions({ k: 1 }, SimplexMode.TRIANGLE)).toBe(SimplexMode.LINE);
        });
        it('2 => TRIANGLE', function () {
            expect(modeFromOptions({ k: 2 }, SimplexMode.POINT)).toBe(SimplexMode.TRIANGLE);
            expect(modeFromOptions({ k: 2 }, SimplexMode.POINT)).toBe(SimplexMode.TRIANGLE);
            expect(modeFromOptions({ k: 2 }, SimplexMode.POINT)).toBe(SimplexMode.TRIANGLE);
            expect(modeFromOptions({ k: 2 }, SimplexMode.POINT)).toBe(SimplexMode.TRIANGLE);
        });
    });
    describe("wireFrame", function () {
        it('true should always result in LINE', function () {
            expect(modeFromOptions({ wireFrame: true }, SimplexMode.EMPTY)).toBe(SimplexMode.LINE);
            expect(modeFromOptions({ wireFrame: true }, SimplexMode.POINT)).toBe(SimplexMode.LINE);
            expect(modeFromOptions({ wireFrame: true }, SimplexMode.LINE)).toBe(SimplexMode.LINE);
            expect(modeFromOptions({ wireFrame: true }, SimplexMode.TRIANGLE)).toBe(SimplexMode.LINE);
        });
        it('false should fall back to the default', function () {
            expect(modeFromOptions({ wireFrame: false }, SimplexMode.EMPTY)).toBe(SimplexMode.EMPTY);
            expect(modeFromOptions({ wireFrame: false }, SimplexMode.POINT)).toBe(SimplexMode.POINT);
            expect(modeFromOptions({ wireFrame: false }, SimplexMode.LINE)).toBe(SimplexMode.LINE);
            expect(modeFromOptions({ wireFrame: false }, SimplexMode.TRIANGLE)).toBe(SimplexMode.TRIANGLE);
        });
        it('undefined should fall back to the default', function () {
            expect(modeFromOptions({ wireFrame: void 0 }, SimplexMode.EMPTY)).toBe(SimplexMode.EMPTY);
            expect(modeFromOptions({ wireFrame: void 0 }, SimplexMode.POINT)).toBe(SimplexMode.POINT);
            expect(modeFromOptions({ wireFrame: void 0 }, SimplexMode.LINE)).toBe(SimplexMode.LINE);
            expect(modeFromOptions({ wireFrame: void 0 }, SimplexMode.TRIANGLE)).toBe(SimplexMode.TRIANGLE);
        });
    });
});
