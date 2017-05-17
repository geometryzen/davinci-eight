import { Geometric2 } from './Geometric2';

/**
 * The decimal place up to which the numbers should agree.
 * Make this as large as possible while avoiding rounding errors.
 */
const PRECISION = 14;

describe("Geometric2", function () {
    describe("constructor()", function () {
        it("should be the value 0", function () {
            const zero: Geometric2 = new Geometric2();
            expect(zero.a).toBe(0);
            expect(zero.x).toBe(0);
            expect(zero.y).toBe(0);
            expect(zero.b).toBe(0);
        });
    });

    describe("static e1", function () {
        it("(true) should be the vector (1, 0)", function () {
            const e1: Geometric2 = Geometric2.e1(true);
            expect(e1.a).toBe(0);
            expect(e1.x).toBe(1);
            expect(e1.y).toBe(0);
            expect(e1.b).toBe(0);
            expect(e1.isLocked()).toBe(true);
        });
        it("(false) should be the vector (1, 0)", function () {
            const e1: Geometric2 = Geometric2.e1(false);
            expect(e1.a).toBe(0);
            expect(e1.x).toBe(1);
            expect(e1.y).toBe(0);
            expect(e1.b).toBe(0);
            expect(e1.isLocked()).toBe(false);
        });
    });

    describe("static e2()", function () {
        it("(true) should be the vector (0, 1)", function () {
            const e2: Geometric2 = Geometric2.e2(true);
            expect(e2.a).toBe(0);
            expect(e2.x).toBe(0);
            expect(e2.y).toBe(1);
            expect(e2.b).toBe(0);
            expect(e2.isLocked()).toBe(true);
        });
        it("(false) should be the vector (0, 1)", function () {
            const e2: Geometric2 = Geometric2.e2(false);
            expect(e2.a).toBe(0);
            expect(e2.x).toBe(0);
            expect(e2.y).toBe(1);
            expect(e2.b).toBe(0);
            expect(e2.isLocked()).toBe(false);
        });
    });

    describe("static one", function () {
        it("(true) should be the scalar 1", function () {
            const one: Geometric2 = Geometric2.one(true);
            expect(one.a).toBe(1);
            expect(one.x).toBe(0);
            expect(one.y).toBe(0);
            expect(one.b).toBe(0);
            expect(one.isLocked()).toBe(true);
        });
        it("(false) should be the scalar 1", function () {
            const one: Geometric2 = Geometric2.one(false);
            expect(one.a).toBe(1);
            expect(one.x).toBe(0);
            expect(one.y).toBe(0);
            expect(one.b).toBe(0);
            expect(one.isLocked()).toBe(false);
        });
    });

    describe("static I", function () {
        it("(true) should be the pseudoscalar 1", function () {
            const I: Geometric2 = Geometric2.I(true);
            expect(I.a).toBe(0);
            expect(I.x).toBe(0);
            expect(I.y).toBe(0);
            expect(I.b).toBe(1);
            expect(I.isLocked()).toBe(true);
        });
        it("(false) should be the pseudoscalar 1", function () {
            const I: Geometric2 = Geometric2.I(false);
            expect(I.a).toBe(0);
            expect(I.x).toBe(0);
            expect(I.y).toBe(0);
            expect(I.b).toBe(1);
            expect(I.isLocked()).toBe(false);
        });
    });

    describe("distanceTo", function () {
        it("(0, 0) should be zero", function () {
            const zero: Geometric2 = Geometric2.zero(true);
            expect(zero.clone().distanceTo(zero)).toBe(0);
        });
        it("(0, e1) should be 1", function () {
            const zero: Geometric2 = Geometric2.zero(true);
            const e1: Geometric2 = Geometric2.vector(1, 0);
            expect(zero.clone().distanceTo(e1)).toBe(1);
        });
        it("(0, e2) should be 1", function () {
            const zero: Geometric2 = Geometric2.zero(true);
            const e2: Geometric2 = Geometric2.vector(0, 1);
            expect(zero.clone().distanceTo(e2)).toBe(1);
        });
        it("(-e2, e2) should be 1", function () {
            const a: Geometric2 = Geometric2.vector(-1, 0);
            const b: Geometric2 = Geometric2.vector(+1, 0);
            expect(a.clone().distanceTo(b)).toBe(2);
        });
        it("(0, e1 + e2) should be sqrt(2)", function () {
            const a: Geometric2 = Geometric2.vector(0, 0);
            const b: Geometric2 = Geometric2.vector(1, 1);
            expect(a.clone().distanceTo(b)).toBe(Math.sqrt(2));
        });
    });

    describe("div", function () {
        it("1 / 1 should be 1", function () {
            const x: Geometric2 = Geometric2.one();
            const ans = x.clone().div(x);
            expect(ans.a).toBe(1);
            expect(ans.x).toBe(0);
            expect(ans.y).toBe(0);
            expect(ans.b).toBe(0);
        });
        it("e1 / e1 should be 1", function () {
            const x: Geometric2 = Geometric2.e1();
            const ans = x.clone().div(x);
            expect(ans.a).toBe(1);
            expect(ans.x).toBe(0);
            expect(ans.y).toBe(0);
            expect(ans.b).toBe(0);
        });
        it("e1 / e2 should be I", function () {
            const ans: Geometric2 = Geometric2.e1().clone().div(Geometric2.e2());
            expect(ans.a).toBe(0);
            expect(ans.x).toBe(0);
            expect(ans.y).toBe(0);
            expect(ans.b).toBe(1);
        });
        it("e2 / e2 should be 1", function () {
            const x: Geometric2 = Geometric2.e2();
            const ans = x.clone().div(x);
            expect(ans.a).toBe(1);
            expect(ans.x).toBe(0);
            expect(ans.y).toBe(0);
            expect(ans.b).toBe(0);
        });
        it("I / I should be 1", function () {
            const I: Geometric2 = Geometric2.e1().clone().mul(Geometric2.e2());
            const ans = I.clone().div(I);
            expect(ans.a).toBe(1);
            expect(ans.x).toBe(0);
            expect(ans.y).toBe(0);
            expect(ans.b).toBe(0);
        });
    });

    describe("inv", function () {
        it("(1) should be 1", function () {
            const one: Geometric2 = Geometric2.one();
            const inv = one.clone().inv();
            expect(inv.a).toBe(1);
            expect(inv.x).toBe(0);
            expect(inv.y).toBe(0);
            expect(inv.b).toBe(0);
        });
        it("(2) should be 0.5", function () {
            const one: Geometric2 = Geometric2.scalar(2);
            const inv = one.clone().inv();
            expect(inv.a).toBe(0.5);
            expect(inv.x).toBe(0);
            expect(inv.y).toBe(0);
            expect(inv.b).toBe(0);
        });
        it("(e1) should be e1", function () {
            const e1: Geometric2 = Geometric2.e1();
            const inv = e1.clone().inv();
            expect(inv.a).toBe(0);
            expect(inv.x).toBe(1);
            expect(inv.y).toBe(0);
            expect(inv.b).toBe(0);
        });
        it("(2 * e1) should be 0.5 * e1", function () {
            const e1: Geometric2 = Geometric2.e1();
            const inv = e1.clone().scale(2).inv();
            expect(inv.a).toBe(0);
            expect(inv.x).toBe(0.5);
            expect(inv.y).toBe(0);
            expect(inv.b).toBe(0);
        });
        it("(e2) should be e2", function () {
            const e2: Geometric2 = Geometric2.e2();
            const inv = e2.clone().inv();
            expect(inv.a).toBe(0);
            expect(inv.x).toBe(0);
            expect(inv.y).toBe(1);
            expect(inv.b).toBe(0);
        });
        it("(2 * e2) should be 0.5 * e2", function () {
            const e2: Geometric2 = Geometric2.e2();
            const inv = e2.clone().scale(2).inv();
            expect(inv.a).toBe(0);
            expect(inv.x).toBe(0);
            expect(inv.y).toBe(0.5);
            expect(inv.b).toBe(0);
        });
        it("(I) should be -I", function () {
            const e1: Geometric2 = Geometric2.e1();
            const e2: Geometric2 = Geometric2.e2();
            const I = e1.clone().mul(e2);
            const inv = I.clone().inv();
            expect(inv.a).toBe(0);
            expect(inv.x).toBe(0);
            expect(inv.y).toBe(0);
            expect(inv.b).toBe(-1);
        });
        it("(2 * I) should be -0.5 * I", function () {
            const e1: Geometric2 = Geometric2.e1();
            const e2: Geometric2 = Geometric2.e2();
            const I = e1.clone().mul(e2);
            const inv = I.clone().scale(2).inv();
            expect(inv.a).toBe(0);
            expect(inv.x).toBe(0);
            expect(inv.y).toBe(0);
            expect(inv.b).toBe(-0.5);
        });
    });

    describe("magnitude", function () {
        describe("(1) should be 1", function () {
            it("should be the number 1", function () {
                const one: Geometric2 = Geometric2.one();
                expect(one.magnitude()).toBe(1);
                expect(one.equals(Geometric2.one())).toBe(true);
            });
        });
    });

    describe("reflect", function () {
        describe("(n) should be -n * M * n", function () {
            const S = Geometric2.fromCartesian(2, 3, 5, 7);
            const n = Geometric2.vector(1, 2).normalize();
            const T = S.clone().reflect(n);
            const C = n.clone().mul(S).mul(n).scale(-1);

            it("should be the number 1", function () {
                expect(C.a).toBeCloseTo(-2.0, PRECISION);
                expect(C.x).toBeCloseTo(-2.2, PRECISION);
                expect(C.y).toBeCloseTo(-5.4, PRECISION);
                expect(C.b).toBeCloseTo(7, PRECISION);

                expect(T.a).toBeCloseTo(-2.0, PRECISION);
                expect(T.x).toBeCloseTo(-2.2, PRECISION);
                expect(T.y).toBeCloseTo(-5.4, PRECISION);
                expect(T.b).toBeCloseTo(7, PRECISION);
            });
        });
    });
});
