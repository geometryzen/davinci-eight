import QQ from './QQ'

describe("QQ", function() {
    describe("constructor", function() {
        it("numer matches construction argument", function() {
            const x = new QQ(3, 5);
            expect(x.numer).toBe(3);
        });
        it("denom matches construction argument", function() {
            const x = new QQ(3, 5);
            expect(x.denom).toBe(5);
        });
        it("Construction", function() {
            const x = new QQ(1, 1);
            expect(x.numer).toBe(1);
            expect(x.denom).toBe(1);
        });
        it("Construction on zero", function() {
            const x = new QQ(0, 1);
            expect(x.numer).toBe(0);
            expect(x.denom).toBe(1);
        });
        it("GCD", function() {
            const x = new QQ(2, 2);
            expect(x.numer).toBe(1);
            expect(x.denom).toBe(1);
        });
        it("Canonical (-1,3) => (-1,3)", function() {
            const x = new QQ(-1, 3);
            expect(x.numer).toBe(-1);
            expect(x.denom).toBe(3);
        });
        it("Canonical (1,-3) => (-1,3)", function() {
            const x = new QQ(1, -3);
            expect(x.numer).toBe(-1);
            expect(x.denom).toBe(3);
        });
        it("add QQ", function() {
            const x = new QQ(1, 3);
            const y = new QQ(2, 1);
            const sum = x.add(y);
            expect(sum.numer).toBe(7);
            expect(sum.denom).toBe(3);
            expect(x.numer).toBe(1);
            expect(x.denom).toBe(3);
            expect(y.numer).toBe(2);
            expect(y.denom).toBe(1);
        });
        it("sub QQ", function() {
            const x = new QQ(1, 3);
            const y = new QQ(2, 1);
            const sum = x.sub(y);
            expect(sum.numer).toBe(-5);
            expect(sum.denom).toBe(3);
            expect(x.numer).toBe(1);
            expect(x.denom).toBe(3);
            expect(y.numer).toBe(2);
            expect(y.denom).toBe(1);
        });
        it("mul", function() {
            const x = new QQ(1, 3);
            const y = new QQ(2, 1);
            const sum = x.mul(y);
            expect(sum.numer).toBe(2);
            expect(sum.denom).toBe(3);
            expect(x.numer).toBe(1);
            expect(x.denom).toBe(3);
            expect(y.numer).toBe(2);
            expect(y.denom).toBe(1);
        });
        it("div", function() {
            const x = new QQ(0, 1);
            const y = new QQ(2, 1);
            const q = x.div(y);
            expect(q.numer).toBe(0);
            expect(q.denom).toBe(1);
            expect(x.numer).toBe(0);
            expect(x.denom).toBe(1);
            expect(y.numer).toBe(2);
            expect(y.denom).toBe(1);
        });
        it("neg() should change the sign of the numerator", function() {
            const x = new QQ(1, 3);
            const n = x.neg();
            expect(x.numer).toBe(+1);
            expect(n.numer).toBe(-1);
        });
        it("neg() should leave the denominator unchanged", function() {
            const x = new QQ(1, 3);
            const n = x.neg();
            expect(x.denom).toBe(+3);
            expect(n.denom).toBe(+3);
        });
        return it("toString", function() {
            const x = new QQ(1, 2);
            expect("" + x).toBe("1/2");
        });
    });
});
