import Spinor2 from './Spinor2'

describe("Spinor2", function() {

    describe("constructor", function() {
        it("coords argument should be preserved", function() {
            var coords = [2, 3];
            var m = new Spinor2(coords);
            expect(m.coords).toBe(coords);
            expect(m.coords[0]).toBe(coords[0]);
            expect(m.coords[1]).toBe(coords[1]);
            expect(m.modified).toBe(false);
        });

        it("no argument should create identity", function() {
            var m = new Spinor2();
            expect(m.α).toBe(1);
            expect(m.β).toBe(0);
            expect(m.modified).toBe(false);
        });
    });

    describe("clone", function() {
        it("should preserve coordinates, uom and the (false) modified flag", function() {
            const source = new Spinor2();
            source.α = Math.random()
            source.β = Math.random()
            source.modified = false
            const m = source.clone();
            expect(m.α).toBe(source.α);
            expect(m.β).toBe(source.β);
            expect(m.modified).toBe(false);
        });
        it("should preserve coordinates, uom and the (true) modified flag", function() {
            var source = new Spinor2();
            source.α = Math.random()
            source.β = Math.random()
            source.modified = true
            var m = source.clone();
            expect(m.α).toBe(source.α);
            expect(m.β).toBe(source.β);
            expect(m.modified).toBe(true);
        });

        describe("copy", function() {
            it("should preserve values and set modified flag", function() {
                var source = new Spinor2();
                source.α = Math.random()
                source.β = Math.random()
                var m = new Spinor2().copy(source);
                expect(m.α).toBe(source.α);
                expect(m.β).toBe(source.β);
                expect(m.modified).toBe(true);
            });

            it("should preserved modified flag when no change", function() {
                var source = new Spinor2();
                source.α = Math.random()
                source.β = Math.random()
                var m = new Spinor2().copy(source);
                expect(m.α).toBe(source.α);
                expect(m.β).toBe(source.β);
                expect(m.modified).toBe(true);
            });
        });

        describe("exp", function() {
            it("should preserve the identity", function() {
                var m = new Spinor2();
                m.α = 1
                m.β = 0
                var r = m.exp();
                expect(m.α).toBe(Math.exp(1));
                expect(m.β).toBe(0);
                expect(m.modified).toBe(true);
                expect(r).toBe(m);
            });

            it("should correspond with scalar exponentiation", function() {
                var m = new Spinor2();
                m.α = 3
                m.β = 0
                var clone = m.clone();
                m.exp();
                expect(m.α).toBe(Math.exp(clone.α));
                expect(m.β).toBe(0);
                expect(m.modified).toBe(true);
            });
        });

        describe("scale", function() {
            it("should multiply each coordinate by the scalar value", function() {
                var m = new Spinor2([2, 3]).scale(2);
                expect(m.coords[0]).toBe(4);
                expect(m.coords[1]).toBe(6);
                expect(m.modified).toBe(true);
            });
        });
    });
});
