import RigidBody from './RigidBody'
import SphereGeometry from '../geometries/SphereGeometry'
import MeshMaterial from '../materials/MeshMaterial'
import Spinor3 from '../math/Spinor3'
import Vector3 from '../math/Vector3'

describe('RigidBody', function() {
    it("should be shareable", function() {
        const geometry = new SphereGeometry()
        const material = new MeshMaterial()
        const deviation = new Spinor3()
        const direction = new Vector3()
        const sphere = new RigidBody('Foo', deviation, direction)
        sphere.geometry = geometry
        sphere.material = material
        expect(sphere.isZombie()).toBe(false)
        sphere.release()
        expect(sphere.isZombie()).toBe(true)
    })
    it("mass should default to 1", function() {
        const geometry = new SphereGeometry()
        const material = new MeshMaterial()
        const deviation = new Spinor3()
        const direction = new Vector3()
        const sphere = new RigidBody('Foo', deviation, direction)
        sphere.geometry = geometry
        sphere.material = material
        expect(sphere.mass).toBe(1)
        sphere.release()
    })
    it("momentum should default to 0", function() {
        const geometry = new SphereGeometry()
        const material = new MeshMaterial()
        const deviation = new Spinor3()
        const direction = new Vector3()
        const sphere = new RigidBody('Foo', deviation, direction)
        sphere.geometry = geometry
        sphere.material = material
        expect(sphere.momentum.α).toBe(0)
        expect(sphere.momentum.x).toBe(0)
        expect(sphere.momentum.y).toBe(0)
        expect(sphere.momentum.z).toBe(0)
        expect(sphere.momentum.xy).toBe(0)
        expect(sphere.momentum.yz).toBe(0)
        expect(sphere.momentum.zx).toBe(0)
        expect(sphere.momentum.β).toBe(0)
        sphere.release()
    })
})
