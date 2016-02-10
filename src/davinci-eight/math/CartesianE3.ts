import mustBeNumber from '../checks/mustBeNumber'
import readOnly from '../i18n/readOnly'
import VectorE3 from '../math/VectorE3'

export default class CartesianE3 implements VectorE3 {
    private coordinates: number[];
    constructor(x: number, y: number, z: number, areYouSure: boolean) {
        mustBeNumber('x', x)
        mustBeNumber('y', y)
        mustBeNumber('z', z)
        this.coordinates = [x, y, z]
        if (!areYouSure) {
            console.warn("Try constructing CartesianE3 from geometric static methods.")
        }
    }
    get x(): number {
        return this.coordinates[0]
    }
    set x(unused) {
        throw new Error(readOnly('x').message)
    }
    get y(): number {
        return this.coordinates[1]
    }
    set y(unused) {
        throw new Error(readOnly('y').message)
    }
    get z(): number {
        return this.coordinates[2]
    }
    set z(unused) {
        throw new Error(readOnly('z').message)
    }
    magnitude(): number {
        return Math.sqrt(this.squaredNorm())
    }
    squaredNorm(): number {
        const x = this.x
        const y = this.y
        const z = this.z
        return x * x + y * y + z * z
    }
    static fromVectorE3(vector: VectorE3): CartesianE3 {
        return new CartesianE3(vector.x, vector.y, vector.z, true)
    }
    static direction(vector: VectorE3): CartesianE3 {
        const x = vector.x
        const y = vector.y
        const z = vector.z
        const m = Math.sqrt(x * x + y * y + z * z)
        return new CartesianE3(x / m, y / m, z / m, true)
    }
}
