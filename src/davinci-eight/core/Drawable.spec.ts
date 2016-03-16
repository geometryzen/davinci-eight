import Drawable from './Drawable'
import Engine from './Engine'
import refChange from './refChange'
import BoxGeometry from '../geometries/BoxGeometry'
import MeshMaterial from '../materials/MeshMaterial'
import MeshMaterialOptions from '../materials/MeshMaterialOptions'

describe("Drawable", function() {
  describe("(void 0, void 0, void 0)", function() {
    it("refChange", function() {
      refChange('quiet')
      refChange('reset')
      refChange('quiet')
      refChange('start')
      const drawable = new Drawable(void 0, void 0, void 0)
      drawable.release()
      const outstanding = refChange('stop')
      expect(outstanding).toBe(0)
      if (outstanding) {
        refChange('dump')
      }
    })
  })
  describe("(void 0, void 0, void 0)", function() {
    it("refChange", function() {
      refChange('quiet')
      refChange('reset')
      refChange('quiet')
      refChange('start')
      const engine = new Engine()
      const geometry = new BoxGeometry()
      const matOptions: MeshMaterialOptions = {}
      const material = new MeshMaterial(matOptions, engine)
      const drawable = new Drawable(geometry, material, engine)
      geometry.release()
      material.release()
      engine.release()
      drawable.release()
      const outstanding = refChange('stop')
      expect(outstanding).toBe(0)
      if (outstanding) {
        refChange('dump')
      }
    })
  })
})
