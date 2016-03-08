import RigidBody from './RigidBody'
import SphereGeometry from '../geometries/SphereGeometry'
import MeshMaterial from '../materials/MeshMaterial'
import Vector3 from '../math/Vector3'

describe('RigidBody', function() {
  it("should be shareable", function() {
    const geometry = new SphereGeometry()
    const material = new MeshMaterial(null, null, 0)
    const direction = new Vector3()
    const rigidBody = new RigidBody('Foo', direction, 0)
    rigidBody.geometry = geometry
    rigidBody.material = material
    expect(rigidBody.isZombie()).toBe(false)
    rigidBody.release()
    expect(rigidBody.isZombie()).toBe(true)
  })
  it("mass should default to 1", function() {
    const geometry = new SphereGeometry()
    const material = new MeshMaterial(null, null, 0)
    const direction = new Vector3()
    const rigidBody = new RigidBody('Foo', direction, 0)
    rigidBody.geometry = geometry
    rigidBody.material = material
    expect(rigidBody.mass).toBe(1)
    rigidBody.release()
  })
  it("momentum should default to 0", function() {
    const geometry = new SphereGeometry()
    const material = new MeshMaterial(null, null, 0)
    const direction = new Vector3()
    const rigidBody = new RigidBody('Foo', direction, 0)
    rigidBody.geometry = geometry
    rigidBody.material = material
    expect(rigidBody.momentum.α).toBe(0)
    expect(rigidBody.momentum.x).toBe(0)
    expect(rigidBody.momentum.y).toBe(0)
    expect(rigidBody.momentum.z).toBe(0)
    expect(rigidBody.momentum.xy).toBe(0)
    expect(rigidBody.momentum.yz).toBe(0)
    expect(rigidBody.momentum.zx).toBe(0)
    expect(rigidBody.momentum.β).toBe(0)
    rigidBody.release()
  })
})
