import GeometryContainer from './GeometryContainer'
import R3 from '../math/R3'
import SpinorE3 from '../math/SpinorE3'
import Spinor3 from '../math/Spinor3'

/**
 * Mock the Geometry so that we can call the protected setScale method.
 * This, incidentally, is the pattern for geometry implementations.
 */
class MockGeometry extends GeometryContainer {
    /**
     * We keep a local cache of properties to maintain accuracy.
     * The scaling matrix would otherwise contain excessive errors.
     */
    private w: number = 1
    private h: number = 1
    private d: number = 1
    constructor(tilt: SpinorE3) {
        super('Foo', tilt)
    }

    /**
     * We decide that in the canonical configuration,
     * w means the x-direction, h is the y-direction, and d is the z-direction.
     */
    setPrincipalScale(name: string, value: number): void {
        switch (name) {
            case 'width': {
                this.w = value
            }
                break
            case 'height': {
                this.h = value
            }
                break
            case 'depth': {
                this.d = value
            }
                break
            default: {
                throw new Error(`${name}`)
            }
        }
        // How we set the diagonal stress tensor reflects our choice for naming variables
        // in the canonical configuration.
        this.setScale(this.w, this.h, this.d)
    }
}

describe("GeometryContainer", function() {
    describe("scaling", function() {
        it("scaling should be 1 when no tilt supplied", function() {
            const geometry = new MockGeometry(void 0)
            expect(geometry.scaling.isOne()).toBe(true)
        })
        it("scaling should be 1 when tilt is 1", function() {
            const geometry = new MockGeometry(Spinor3.one())
            expect(geometry.scaling.isOne()).toBe(true)
        })
        it("scaling should coincide with canonical configuration when tilt is 1", function() {
            const geometry = new MockGeometry(Spinor3.one())
            geometry.setPrincipalScale('width', 2)
            geometry.setPrincipalScale('height', 3)
            geometry.setPrincipalScale('depth', 5)
            expect(geometry.scaling.getElement(0, 0)).toBe(2)
            expect(geometry.scaling.getElement(1, 1)).toBe(3)
            expect(geometry.scaling.getElement(2, 2)).toBe(5)
        })
        it("scaling should exchange x and y when rotor is e2 ^ e1", function() {
            const geometry = new MockGeometry(Spinor3.rotorFromDirections(R3.e2, R3.e1))
            geometry.setPrincipalScale('width', 2)
            geometry.setPrincipalScale('height', 3)
            geometry.setPrincipalScale('depth', 5)
            expect(geometry.scaling.getElement(0, 0)).toBe(3)
            expect(geometry.scaling.getElement(1, 1)).toBe(2)
            expect(geometry.scaling.getElement(2, 2)).toBe(5)
        })
        it("scaling should exchange y and z when rotor is e3 ^ e2", function() {
            const geometry = new MockGeometry(Spinor3.rotorFromDirections(R3.e3, R3.e2))
            geometry.setPrincipalScale('width', 2)
            geometry.setPrincipalScale('height', 3)
            geometry.setPrincipalScale('depth', 5)
            expect(geometry.scaling.getElement(0, 0)).toBe(2)
            expect(geometry.scaling.getElement(1, 1)).toBe(5)
            expect(geometry.scaling.getElement(2, 2)).toBe(3)
        })
        it("scaling should exchange z and x when rotor is e1 ^ e3", function() {
            const geometry = new MockGeometry(Spinor3.rotorFromDirections(R3.e1, R3.e3))
            geometry.setPrincipalScale('width', 2)
            geometry.setPrincipalScale('height', 3)
            geometry.setPrincipalScale('depth', 5)
            expect(geometry.scaling.getElement(0, 0)).toBe(5)
            expect(geometry.scaling.getElement(1, 1)).toBe(3)
            expect(geometry.scaling.getElement(2, 2)).toBe(2)
        })
        it("scaling should cycle x -> z -> y -> x when rotor is e1 ^ e2 followed by e2 ^ e3", function() {
            const s1 = Spinor3.rotorFromDirections(R3.e1, R3.e2)
            const s2 = Spinor3.rotorFromDirections(R3.e2, R3.e3)
            const s = s2.mul(s1)
            const geometry = new MockGeometry(s)
            geometry.setPrincipalScale('width', 2)
            geometry.setPrincipalScale('height', 3)
            geometry.setPrincipalScale('depth', 5)
            expect(geometry.scaling.getElement(0, 0)).toBe(3)
            expect(geometry.scaling.getElement(1, 1)).toBe(5)
            expect(geometry.scaling.getElement(2, 2)).toBe(2)
        })
    })
})
