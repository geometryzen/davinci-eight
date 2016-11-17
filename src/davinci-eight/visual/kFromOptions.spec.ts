import kFromOptions from './kFromOptions';

// const EMPTY = -1;
// const POINT = 0;
const LINE = 1;
const TRIANGLE = 2;

describe('kFromOptions', function () {
    describe("for common case of", function () {
        it('default', function () {
            expect(kFromOptions()).toBe(TRIANGLE);
        });
        it('missing', function () {
            expect(kFromOptions({})).toBe(TRIANGLE);
        });
    });
    describe("wireFrame", function () {
        it('true', function () {
            expect(kFromOptions({ wireFrame: true })).toBe(LINE);
        });
        it('false', function () {
            expect(kFromOptions({ wireFrame: false })).toBe(TRIANGLE);
        });
        it('undefined', function () {
            expect(kFromOptions({ wireFrame: void 0 })).toBe(TRIANGLE);
        });
    });
    describe("k", function () {
        it('1', function () {
            expect(kFromOptions({ k: 1 })).toBe(LINE);
        });
        it('2', function () {
            expect(kFromOptions({ k: 2 })).toBe(TRIANGLE);
        });
    });
});
