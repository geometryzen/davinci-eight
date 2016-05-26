import R3 from './R3'
import {Unit} from './Unit'

describe("R3", function() {
    describe("constructor", function() {
        it("should move units multiplier to coordinates (coexistence with dimensionless)", function() {
            const v = new R3(2, 3, 5, Unit.ONE.scale(2))
            expect(v.x).toBe(4)
            expect(v.y).toBe(6)
            expect(v.z).toBe(10)
            expect(v.uom.isOne()).toBe(true)
        })
    })
    describe("e1", function() {
        it("should be the standard basis vector (1, 0, 0)", function() {
            const e1 = R3.e1
            expect(e1.x).toBe(1)
            expect(e1.y).toBe(0)
            expect(e1.z).toBe(0)
            expect(e1.uom.isOne()).toBe(true)
        })
    })
    describe("e2", function() {
        it("should be the standard basis vector (0, 1, 0)", function() {
            const e2 = R3.e2
            expect(e2.x).toBe(0)
            expect(e2.y).toBe(1)
            expect(e2.z).toBe(0)
            expect(e2.uom.isOne()).toBe(true)
        })
    })
    describe("e3", function() {
        it("should be the standard basis vector (0, 0, 1)", function() {
            const e3 = R3.e3
            expect(e3.x).toBe(0)
            expect(e3.y).toBe(0)
            expect(e3.z).toBe(1)
            expect(e3.uom.isOne()).toBe(true)
        })
    })
    describe("zero", function() {
        it("should be the standard zero vector (0, 0, 0)", function() {
            const zero = R3.zero
            expect(zero.x).toBe(0)
            expect(zero.y).toBe(0)
            expect(zero.z).toBe(0)
            expect(zero.uom.isOne()).toBe(true)
        })
    })
    describe("direction", function() {
        it("of the zero vector is ambiguous", function() {
            const zero = R3.direction(R3.zero)
            expect(zero.x).toBeNaN()
            expect(zero.y).toBeNaN()
            expect(zero.z).toBeNaN()
            expect(zero.uom.isOne()).toBe(true)
        })
        it("should not change the e1 vector", function() {
            const n = R3.direction(R3.e1)
            expect(n.x).toBe(R3.e1.x)
            expect(n.y).toBe(R3.e1.y)
            expect(n.z).toBe(R3.e1.z)
            expect(n.uom.isOne()).toBe(true)
        })
        it("should not change the e2 vector", function() {
            const n = R3.direction(R3.e2)
            expect(n.x).toBe(R3.e2.x)
            expect(n.y).toBe(R3.e2.y)
            expect(n.z).toBe(R3.e2.z)
            expect(n.uom.isOne()).toBe(true)
        })
        it("should not change the e3 vector", function() {
            const n = R3.direction(R3.e3)
            expect(n.x).toBe(R3.e3.x)
            expect(n.y).toBe(R3.e3.y)
            expect(n.z).toBe(R3.e3.z)
            expect(n.uom.isOne()).toBe(true)
        })
    })
    describe("fromVector", function() {
        it("should respect the uom", function() {
            const up = R3.fromVector(R3.e2, Unit.METER)
            expect(up.x).toBe(R3.e2.x)
            expect(up.y).toBe(R3.e2.y)
            expect(up.z).toBe(R3.e2.z)
            expect(up.uom.isOne()).toBe(false)
            expect(up.uom.dimensions.M.numer).toBe(0)
            expect(up.uom.dimensions.M.denom).toBe(1)
            expect(up.uom.dimensions.L.numer).toBe(1)
            expect(up.uom.dimensions.L.denom).toBe(1)
            expect(up.uom.dimensions.T.numer).toBe(0)
            expect(up.uom.dimensions.T.denom).toBe(1)
        })
    })
    describe("toFixed", function() {
        it("zero", function() {
            expect(R3.zero.toFixed(2)).toBe("0")
        })
        it("e1", function() {
            expect(R3.e1.toFixed(2)).toBe("e1")
        })
        it("e2", function() {
            expect(R3.e2.toFixed(3)).toBe("e2")
        })
        it("e3", function() {
            expect(R3.e3.toFixed(4)).toBe("e3")
        })
    })
    describe("toString", function() {
        it("e1", function() {
            expect(R3.e1.toString()).toBe("e1")
        })
        it("e2", function() {
            expect(R3.e2.toString()).toBe("e2")
        })
        it("e3", function() {
            expect(R3.e3.toString()).toBe("e3")
        })
    })
    describe("squaredNorm", function() {
        it("should respect the uom", function() {
            const up: R3 = R3.fromVector(R3.e2, Unit.METER)
            const s: Unit = up.squaredNorm()
            expect(s.multiplier).toBe(1)
            expect(s.isOne()).toBe(false)
            expect(s.dimensions.M.numer).toBe(0)
            expect(s.dimensions.M.denom).toBe(1)
            expect(s.dimensions.L.numer).toBe(2)
            expect(s.dimensions.L.denom).toBe(1)
            expect(s.dimensions.T.numer).toBe(0)
            expect(s.dimensions.T.denom).toBe(1)
        })
    })
    describe("magnitude", function() {
        it("should respect the uom", function() {
            const up: R3 = R3.fromVector(R3.e2, Unit.METER)
            const m: Unit = up.magnitude()
            expect(m.toString()).toBe('m')
            expect(m.multiplier).toBe(1)
            expect(m.isOne()).toBe(false)
            expect(m.dimensions.M.numer).toBe(0)
            expect(m.dimensions.M.denom).toBe(1)
            expect(m.dimensions.L.numer).toBe(1)
            expect(m.dimensions.L.denom).toBe(1)
            expect(m.dimensions.T.numer).toBe(0)
            expect(m.dimensions.T.denom).toBe(1)
        })
    })
})
