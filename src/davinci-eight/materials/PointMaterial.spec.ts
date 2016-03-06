import Engine from '../core/Engine'
import PointMaterial from './PointMaterial'
import PointMaterialOptions from '../materials/PointMaterialOptions'

describe("PointMaterial", function() {
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
