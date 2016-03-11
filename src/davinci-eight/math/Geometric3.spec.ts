import Geometric3 from './Geometric3'
import R3 from './R3'
import Unit from './Unit'

describe("Geometric3", function() {

  describe("equals", function() {
    it("(M) should be eqial to M", function() {
      const zero: Geometric3 = Geometric3.zero()
      const one: Geometric3 = Geometric3.one()
      expect(zero.equals(zero)).toBe(true)
      expect(one.equals(one)).toBe(true)
      expect(zero.equals(one)).toBe(false)
      expect(one.equals(zero)).toBe(false)
    })
  })

  describe('events', function() {
    let eventName: string
    let key: string
    let value: number
    let source: Geometric3
    function callback(n: string, k: string, v: number, s: Geometric3) {
      eventName = n
      key = k
      value = v
      source = s
    }
    it("should fire the callback function appropriately", function() {
      const M: Geometric3 = Geometric3.zero()

      M.on('change', callback)

      expect(eventName).toBeUndefined()
      expect(key).toBeUndefined()
      expect(value).toBeUndefined()
      expect(source).toBeUndefined()

      M.addScalar(1)
      expect(eventName).toBe('change')
      expect(key).toBe('α')
      expect(value).toBe(1)
      expect(source).toEqual(M)

      eventName = void 0
      key = void 0
      value = void 0
      source = void 0

      M.scale(1)
      expect(eventName).toBeUndefined()
      expect(key).toBeUndefined()
      expect(value).toBeUndefined()
      expect(source).toBeUndefined()
    })
  })

  describe("inv", function() {
    it("(1) should be 1", function() {
      const one: Geometric3 = Geometric3.one()
      const inv = one.clone().inv()
      expect(inv.equals(one)).toBe(true)
    })
    it("(2) should be 0.5", function() {
      const two: Geometric3 = Geometric3.scalar(2)
      const inv = two.clone().inv()
      const half: Geometric3 = Geometric3.scalar(0.5)
      expect(inv.equals(half)).toBe(true)
    })
    it("(e1) should be e1", function() {
      const e1: Geometric3 = Geometric3.e1()
      const inv = e1.clone().inv()
      expect(inv.equals(e1)).toBe(true)
    })
    it("(2 * e1) should be 0.5 * e1", function() {
      const e1: Geometric3 = Geometric3.e1()
      const inv = e1.clone().scale(2).inv()
      const halfE1 = e1.clone().scale(0.5)
      expect(inv.equals(halfE1)).toBe(true)
    })
    it("(e2) should be e2", function() {
      const e2: Geometric3 = Geometric3.e2()
      const inv = e2.clone().inv()
      expect(inv.equals(e2)).toBe(true)
    })
    it("(2 * e2) should be 0.5 * e2", function() {
      const e2: Geometric3 = Geometric3.e2()
      const inv = e2.clone().scale(2).inv()
      const halfE2 = e2.clone().scale(0.5)
      expect(inv.equals(halfE2)).toBe(true)
    })
    it("(e3) should be e3", function() {
      const e3: Geometric3 = Geometric3.e3()
      const inv = e3.clone().inv()
      expect(inv.equals(e3)).toBe(true)
    })
    it("(2 * e3) should be 0.5 * e3", function() {
      const e3: Geometric3 = Geometric3.e3()
      const inv = e3.clone().scale(2).inv()
      const halfE3 = e3.clone().scale(0.5)
      expect(inv.equals(halfE3)).toBe(true)
    })
    it("(I) should be -I", function() {
      const e1: Geometric3 = Geometric3.e1()
      const e2: Geometric3 = Geometric3.e2()
      const e3: Geometric3 = Geometric3.e3()
      const I = e1.clone().mul(e2).mul(e3)
      const inv = I.clone().inv()
      const minusI = I.clone().neg()
      expect(inv.equals(minusI)).toBe(true)
    })
    it("(2 * I) should be -0.5 * I", function() {
      const e1: Geometric3 = Geometric3.e1()
      const e2: Geometric3 = Geometric3.e2()
      const e3: Geometric3 = Geometric3.e3()
      const I = e1.clone().mul(e2).mul(e3)
      const inv = I.clone().scale(2).inv()
      const minusHalfI = I.clone().neg().scale(0.5)
      expect(inv.equals(minusHalfI)).toBe(true)
    })
  })

  describe("stress", function() {
    const stress = R3.vector(7, 11, 13, Unit.ONE)
    const position = Geometric3.vector(2, 3, 5)
    const chain = position.stress(stress)

    it("should piece-wise multiply grade 1 components", function() {
      expect(position.x).toBe(14)
      expect(position.y).toBe(33)
      expect(position.z).toBe(65)
    })
    it("should be chainable", function() {
      expect(chain === position).toBe(true)
    })
  })
})
