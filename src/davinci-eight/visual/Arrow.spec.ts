import {Arrow} from './Arrow'
import ArrowOptions from './ArrowOptions'
import {Geometric3} from '../math/Geometric3'

const e1: Geometric3 = Geometric3.e1()
const e2: Geometric3 = Geometric3.e2()
// const e3: Geometric3 = Geometric3.e3()

describe("Arrow", function() {
  it("new-release", function() {
    const arrow = new Arrow()
    expect(arrow.isZombie()).toBe(false)
    arrow.release()
    expect(arrow.isZombie()).toBe(true)
  })
  describe("position", function() {
    it("should be initialized to zero", function() {
      const arrow = new Arrow()
      expect(arrow.X.isZero()).toBe(true)
      arrow.release()
    })
  })
  describe("attitude", function() {
    it("should be initialized to unity", function() {
      const arrow = new Arrow()
      expect(arrow.R.isOne()).toBe(true)
      arrow.release()
    })
  })
  describe("h", function() {
    it("should default to e2", function() {
      const arrow = new Arrow()
      expect(arrow.h.toString()).toBe('e2')
      expect(arrow.h.equals(e2)).toBe(true)
      arrow.release()
    })
    // The length property has been made private.
    // Updates are expected to happen through the 
    describe("changing the length property", function() {
      describe("from the default", function() {
        xit("should update the h property", function() {
          const arrow = new Arrow()
          // arrow.length = 2
          expect(arrow.h.equals(e2.clone().scale(2))).toBe(true)
          arrow.release()
        })
        xit("should update the length property", function() {
          const arrow = new Arrow()
          // arrow.length = 2
          // expect(arrow.length).toBe(2)
          arrow.release()
        })
        xit("should NOT update the attitude property", function() {
          const arrow = new Arrow()
          // arrow.length = 2
          expect(arrow.R.isOne()).toBe(true)
          arrow.release()
        })
      })
    })
    describe("changing the h property", function() {
      describe("from the default", function() {
        it("should update the h property", function() {
          const arrow = new Arrow()
          arrow.h = e1.clone().scale(2)
          expect(arrow.h.equals(e1.clone().scale(2))).toBe(true)
          arrow.release()
        })
        xit("should update the length property", function() {
          const arrow = new Arrow()
          arrow.h = e1.clone().scale(2)
          expect(arrow.h).toBe(2)
          arrow.release()
        })
        it("should update the attitude property", function() {
          const arrow = new Arrow()
          arrow.h = e1.clone().scale(2)
          expect(arrow.R.equals(Geometric3.rotorFromDirections(e2, e1))).toBe(true)
          arrow.release()
        })
      })
    })
  })
  describe("options", function() {
    it("should be initialized to unity", function() {
      const options: ArrowOptions = {}
      options.vector = options.vector
      options.attitude = options.attitude
      options.color = options.color
      options.engine = options.engine
      options.offset = options.offset
      options.position = options.position
      options.tilt = options.tilt
      const arrow = new Arrow(options)
      expect(arrow.R.isOne()).toBe(true)
      arrow.release()
    })
  })
})
