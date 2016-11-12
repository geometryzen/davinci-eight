import { Engine } from '../core/Engine'
import { MeshMaterial } from './MeshMaterial'
import MeshMaterialOptions from '../materials/MeshMaterialOptions'

describe("MeshMaterial", function () {
  describe("(void 0, null)", function () {
    const matOptions: MeshMaterialOptions = void 0
    const engine: Engine = new Engine()
    const material = new MeshMaterial(engine, matOptions)
    it("should contain aPosition", function () {
      expect(material.vertexShaderSrc).toContain("attribute vec3 aPosition;")
    })
  })
})
