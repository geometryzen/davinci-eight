import {Sphere} from './Sphere'

describe('Sphere', function() {
    it("should be shareable", function() {
        const sphere = new Sphere()
        expect(sphere.isZombie()).toBe(false)
        sphere.release()
        expect(sphere.isZombie()).toBe(true)
    })
    it("radius should default to 1", function() {
        const sphere = new Sphere()
        expect(sphere.radius).toBe(1)
        sphere.release()
    })
})
