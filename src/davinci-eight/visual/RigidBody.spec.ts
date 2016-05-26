import {RigidBody} from './RigidBody'
import SphereGeometry from '../geometries/SphereGeometry'
import {MeshMaterial} from '../materials/MeshMaterial'
import Vector3 from '../math/Vector3'

describe('RigidBody', function() {
  it("should be shareable", function() {
    const geometry = new SphereGeometry()
    const material = new MeshMaterial(null, null)
    const direction = new Vector3()
    const rigidBody = new RigidBody(void 0, void 0, void 0, direction)
    rigidBody.geometry = geometry
    rigidBody.material = material
    expect(rigidBody.isZombie()).toBe(false)
    rigidBody.release()
    expect(rigidBody.isZombie()).toBe(true)
  })
  it("mass should default to 1", function() {
    const geometry = new SphereGeometry()
    const material = new MeshMaterial(null, null)
    const direction = new Vector3()
    const rigidBody = new RigidBody(void 0, void 0, void 0, direction)
    rigidBody.geometry = geometry
    rigidBody.material = material
    expect(rigidBody.m).toBe(1)
    rigidBody.release()
  })
  it("momentum should default to 0", function() {
    const geometry = new SphereGeometry()
    const material = new MeshMaterial(null, null)
    const direction = new Vector3()
    const rigidBody = new RigidBody(void 0, void 0, void 0, direction)
    rigidBody.geometry = geometry
    rigidBody.material = material
    expect(rigidBody.P.isZero()).toBeTruthy()
    expect(rigidBody.P.α).toBe(0)
    expect(rigidBody.P.x).toBe(0)
    expect(rigidBody.P.y).toBe(0)
    expect(rigidBody.P.z).toBe(0)
    expect(rigidBody.P.xy).toBe(0)
    expect(rigidBody.P.yz).toBe(0)
    expect(rigidBody.P.zx).toBe(0)
    expect(rigidBody.P.β).toBe(0)
    rigidBody.release()
  })
  it("charge should default to 0", function() {
    const geometry = new SphereGeometry()
    const material = new MeshMaterial(null, null)
    const direction = new Vector3()
    const rigidBody = new RigidBody(void 0, void 0, void 0, direction)
    rigidBody.geometry = geometry
    rigidBody.material = material
    expect(rigidBody.Q.isZero()).toBeTruthy()
    rigidBody.release()
  })
})
