import Color from '../core/Color'
import DirectionalLight from './DirectionalLight'
import R3 from '../math/R3'
import Unit from '../math/Unit'
import Vector3 from '../math/Vector3'

describe("DirectionalLight", function() {
  describe("direction", function() {

    it("should have a (get) color property", function() {
      const dirLight = new DirectionalLight()
      expect(dirLight.color).toBeDefined()
    })

    it("should have a (set) color property", function() {
      const dirLight = new DirectionalLight()
      const color = Color.random()
      const colorFixed = Color.copy(color)
      dirLight.color = color
      expect(dirLight.color.r).toBe(colorFixed.r)
      expect(dirLight.color.g).toBe(colorFixed.g)
      expect(dirLight.color.b).toBe(colorFixed.b)
    })

    it("should have a (get) direction property", function() {
      const dirLight = new DirectionalLight()
      expect(dirLight.direction).toBeDefined()
    })

    it("should have a (set) direction property", function() {
      const dirLight = new DirectionalLight()
      const direction = Vector3.random()
      const dirFixed = R3.fromVector(direction, Unit.ONE)
      dirLight.direction = direction
      expect(dirLight.direction.x).toBe(dirFixed.x)
      expect(dirLight.direction.y).toBe(dirFixed.y)
      expect(dirLight.direction.z).toBe(dirFixed.z)
    })

    it("should have a mutable direction property", function() {
      const dirLight = new DirectionalLight()
      const direction = Vector3.random()
      const dirFixed = R3.fromVector(direction, Unit.ONE)
      dirLight.direction.copy(dirFixed)
      expect(dirLight.direction.x).toBe(dirFixed.x)
      expect(dirLight.direction.y).toBe(dirFixed.y)
      expect(dirLight.direction.z).toBe(dirFixed.z)
    })

  })
})
