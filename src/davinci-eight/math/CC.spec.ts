import CC from './CC'

describe("CC", function() {

    // (x, y) is the Cartesian vector interpretation of the complex number.
    it("constructor(x,y)", function() {
        var x = Math.random();
        var y = Math.random();
        var z = new CC(x, y);
        expect(z.x).toBe(x);
        expect(z.y).toBe(y);
    });

    // (α, β) is the spinor interpretation of the complex number.
    it("constructor(α, β)", function() {
        var α = Math.random();
        var β = Math.random();
        var z = new CC(α, β);
        expect(z.a).toBe(α);
        expect(z.b).toBe(β);
    });

    it("toString", function() {
        var x = Math.random();
        var y = Math.random();
        var z = new CC(x, y);
        expect(z.toString()).toBe("CC(" + x + ", " + y + ")");
    });

    it("angle().a", function() {
        var x = Math.random();
        var y = Math.random();
        var z = new CC(x, y);
        expect(z.angle().a).toBe(0);
    });
    it("angle().b", function() {
        var x = Math.random();
        var y = Math.random();
        var z = new CC(x, y);
        expect(z.angle().b).toBe(Math.atan2(y, x));
    });
    it("angle().magnitude()", function() {
        var x = Math.random();
        var y = Math.random();
        var z = new CC(x, y);
        expect(z.angle().magnitude()).toBe(Math.atan2(y, x));
    });

    it("exp", function() {
        var x = Math.random();
        var y = Math.random();
        var z = new CC(x, y);
        expect(z.exp().x).toBe(Math.exp(x) * Math.cos(y));
        expect(z.exp().y).toBe(Math.exp(x) * Math.sin(y));
    });

    it("norm", function() {
        var x = Math.random();
        var y = Math.random();
        var z = new CC(x, y);
        expect(z.norm().x).toBe(Math.sqrt(x * x + y * y));
        expect(z.norm().y).toBe(0);
    });

    it("quad", function() {
        var x = Math.random();
        var y = Math.random();
        var z = new CC(x, y);
        expect(z.quad().x).toBe(x * x + y * y);
        expect(z.quad().y).toBe(0);
    });

    describe("Operator Overloading", function() {

        describe("Binary +", function() {
            var a = new CC(Math.random(), Math.random());
            var b = new CC(Math.random(), Math.random());
            var s = Math.random();

            it("__add__(CC)", function() {
                var z = a.__add__(b);
                expect(z.x).toBe(a.x + b.x);
                expect(z.y).toBe(a.y + b.y);
            });

            it("__add__(number)", function() {
                var z = a.__add__(s);
                expect(z instanceof CC).toBe(true);
                expect(z.x).toBe(a.x + s);
                expect(z.y).toBe(a.y);
            });

            it("__radd__(CC)", function() {
                var z = b.__radd__(a);
                expect(z.x).toBe(a.x + b.x);
                expect(z.y).toBe(a.y + b.y);
            });

            it("__radd__(number)", function() {
                var z = a.__radd__(s);
                expect(z instanceof CC).toBe(true);
                expect(z.x).toBe(s + a.x);
                expect(z.y).toBe(a.y);
            });
        });

        describe("Binary -", function() {
            var a = new CC(Math.random(), Math.random());
            var b = new CC(Math.random(), Math.random());
            var s = Math.random();

            it("__sub__(CC)", function() {
                var z = a.__sub__(b);
                expect(z.x).toBe(a.x - b.x);
                expect(z.y).toBe(a.y - b.y);
            });

            it("__sub__(number)", function() {
                var z = a.__sub__(s);
                expect(z instanceof CC).toBe(true);
                expect(z.x).toBe(a.x - s);
                expect(z.y).toBe(a.y - 0);
            });

            it("__rsub__(CC)", function() {
                var z = b.__rsub__(a);
                expect(z.x).toBe(a.x - b.x);
                expect(z.y).toBe(a.y - b.y);
            });

            it("__rsub__(number)", function() {
                var z = a.__rsub__(s);
                expect(z instanceof CC).toBe(true);
                expect(z.x).toBe(s - a.x);
                expect(z.y).toBe(0 - a.y);
            });
        });

        describe("Binary *", function() {
            var a = new CC(Math.random(), Math.random());
            var b = new CC(Math.random(), Math.random());
            var s = Math.random();

            it("__mul__(CC)", function() {
                var z = a.__mul__(b);
                expect(z.x).toBe(a.x * b.x - a.y * b.y);
                expect(z.y).toBe(a.x * b.y + a.y * b.x);
            });

            it("__mul__(number)", function() {
                var z = a.__mul__(s);
                expect(z instanceof CC).toBe(true);
                expect(z.x).toBe(a.x * s);
                expect(z.y).toBe(a.y * s);
            });

            it("__rmul__(CC)", function() {
                var z = b.__rmul__(a);
                expect(z.x).toBe(a.x * b.x - a.y * b.y);
                expect(z.y).toBe(a.x * b.y + a.y * b.x);
            });

            it("__rmul__(number)", function() {
                var z = a.__rmul__(s);
                expect(z instanceof CC).toBe(true);
                expect(z.x).toBe(s * a.x);
                expect(z.y).toBe(s * a.y);
            });
        });

        describe("Binary /", function() {
            var a = new CC(Math.random(), Math.random());
            var b = new CC(Math.random(), Math.random());
            var s = Math.random();

            it("__div__(CC)", function() {
                var z = a.__div__(b);
                var q = b.quad();
                var re = (a.x * b.x + a.y * b.y) / q.x;
                var im = (a.y * b.x - a.x * b.y) / q.x;
                expect(z.x).toBe(re);
                expect(z.y).toBe(im);
            });

            it("__div__(number)", function() {
                var z = a.__div__(s);
                expect(z instanceof CC).toBe(true);
                expect(z.x).toBe(a.x / s);
                expect(z.y).toBe(a.y / s);
            });

            it("__rdiv__(CC)", function() {
                var z = b.__rdiv__(a);
                var expected = a.__div__(b);
                expect(z.x).toBe(expected.x);
                expect(z.y).toBe(expected.y);
            });

            it("__rdiv__(number)", function() {
                var z = a.__rdiv__(s);
                var expected = new CC(s, 0).__div__(a);
                expect(z instanceof CC).toBe(true);
                expect(z.x).toBe(expected.x);
                expect(z.y).toBe(expected.y);
            });
        });
    });
})
