import BoxGeometry from '../geometries/BoxGeometry'
import Mesh from '../core/Mesh'
import MeshMaterial from '../materials/MeshMaterial'
import RigidBodyWithUnits from './RigidBodyWithUnits'
import R3 from '../math/R3'
import G3 from '../math/G3'

describe("RigidBodyWithUnits", function() {

  describe("constructor", function() {

    const geometry = new BoxGeometry()
    const material = new MeshMaterial()
    const mesh = new Mesh('Mesh', geometry, material)
    geometry.release()
    material.release()
    const axis = R3.e3
    const rigidBody = new RigidBodyWithUnits(mesh, R3.e3, 'Foo')

    it("should have mass 1 kg", function() {
      expect(rigidBody.mass.toString()).toBe("1 kg")
    })

    it("should be at the origin with correct units", function() {
      expect(rigidBody.position.toString()).toBe("0 m")
    })

    it("should have zero momentum and correct units", function() {
      expect(rigidBody.momentum.toString()).toBe("0 kg·m/s")
    })

    it("should have attitude 1", function() {
      expect(rigidBody.attitude.toString()).toBe("1")
    })

    it("should have axis equal to the initial axis", function() {
      G3.BASIS_LABELS = G3.BASIS_LABELS_STANDARD
      expect(rigidBody.axis.toString()).toBe(axis.toString())
    })
  })

})
