import {Engine} from '../core/Engine'
import {PointMaterial} from './PointMaterial'
import PointMaterialOptions from '../materials/PointMaterialOptions'

describe("PointMaterial", function() {
  it("new-release", function() {
    const matOptions: PointMaterialOptions = void 0
    const engine: Engine = null
    const material = new PointMaterial(matOptions, engine)
    expect(material.isZombie()).toBe(false)
    material.release()
    expect(material.isZombie()).toBe(true)
  })
  describe("(void 0, null)", function() {
    const matOptions: PointMaterialOptions = void 0
    const engine: Engine = null
    const material = new PointMaterial(matOptions, engine)
    it("should contain aPosition", function() {
      expect(material.vertexShaderSrc).toContain("attribute vec3 aPosition;")
    })
  })
  describe("(null, null)", function() {
    const matOptions: PointMaterialOptions = null
    const engine: Engine = null
    const material = new PointMaterial(matOptions, engine)
    it("should contain aPosition", function() {
      expect(material.vertexShaderSrc).toContain("attribute vec3 aPosition;")
    })
  })
})
