import {Vector2} from './Vector2'

describe("Vector2", function() {

    describe("constructor", function() {
        var data = [Math.random(), Math.random()];
        var vec = new Vector2(data, false);
        it("getComponent(0)", function() {
            expect(vec.getComponent(0)).toBe(data[0]);
        });
        it("getComponent(1)", function() {
            expect(vec.getComponent(1)).toBe(data[1]);
        });
    });

    describe("toString", function() {
        var data = [2, 3];
        var vec = new Vector2(data, false);
        it("should match coordinates with basis vectors", function() {
            expect(vec.toString()).toBe('2*e1+3*e2');
        });
    });

    describe("toFixed", function() {
        var data = [2, 3];
        var vec = new Vector2(data, false);
        it("should display correct number of decimals", function() {
            expect(vec.toFixed(4)).toBe('2.0000*e1+3.0000*e2');
        });
    });

    describe("toExponential", function() {
        var data = [2, 3];
        var vec = new Vector2(data, false);
        it("should display with scientific notation", function() {
            expect(vec.toExponential()).toBe('2e+0*e1+3e+0*e2');
        });
    });

});
