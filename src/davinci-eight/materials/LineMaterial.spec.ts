import Engine from '../core/Engine'
import LineMaterial from './LineMaterial'
import LineMaterialOptions from '../materials/LineMaterialOptions'

describe("LineMaterial", function() {
  it("new-release", function() {
    const matOptions: LineMaterialOptions = void 0
    const engine: Engine = null
    const material = new LineMaterial(matOptions, engine)
    expect(material.isZombie()).toBe(false)
    material.release()
    expect(material.isZombie()).toBe(true)
  })
  describe("(void 0, null)", function() {
    const matOptions: LineMaterialOptions = void 0
    const engine: Engine = null
    const material = new LineMaterial(matOptions, engine)
    it("should contain aPosition", function() {
      expect(material.vertexShaderSrc).toContain("attribute vec3 aPosition;")
    })
  })
  describe("(null, null)", function() {
    const matOptions: LineMaterialOptions = null
    const engine: Engine = null
    const material = new LineMaterial(matOptions, engine)
    it("should contain aPosition", function() {
      expect(material.vertexShaderSrc).toContain("attribute vec3 aPosition;")
    })
  })
})
