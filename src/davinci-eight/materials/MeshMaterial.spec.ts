import Engine from '../core/Engine'
import MeshMaterial from './MeshMaterial'
import MeshMaterialOptions from '../materials/MeshMaterialOptions'

describe("MeshMaterial", function() {
  describe("(void 0, null)", function() {
    const matOptions: MeshMaterialOptions = void 0
    const engine: Engine = null
    const material = new MeshMaterial(matOptions, engine, 0)
    it("should contain aPosition", function() {
      expect(material.vertexShaderSrc).toContain("attribute vec3 aPosition;")
    })
  })
  describe("(null, null)", function() {
    const matOptions: MeshMaterialOptions = null
    const engine: Engine = null
    const material = new MeshMaterial(matOptions, engine, 0)
    it("should contain aPosition", function() {
      expect(material.vertexShaderSrc).toContain("attribute vec3 aPosition;")
    })
  })
})
