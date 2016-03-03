import IContextConsumer from './IContextConsumer'
import Material from './Material'
import Matrix4 from '../math/Matrix4'
import VertexArrays from './VertexArrays'

/**
 * @class Geometry
 */
interface Geometry extends IContextConsumer {

    /**
     * @property data
     * @type VertexArrays
     * @readOnly
     */
    data: VertexArrays

    /**
     * @property partsLength
     * @type number
     * @readOnly
     */
    partsLength: number

    /**
     * @property scaling
     * @type Matrix4
     * @readOnly
     */
    scaling: Matrix4

    /**
     * @method addPart
     * @param geometry {Geometry}
     * @return {void}
     */
    addPart(geometry: Geometry): void

    /**
     * @method removePart
     * @param index {number}
     * @return {void}
     */
    removePart(index: number): void

    /**
     * @method getPart
     * @param index {number}
     * @return {Geometry}
     */
    getPart(index: number): Geometry

    /**
     * @method draw
     * @param material {Material}
     * @return {void}
     */
    draw(material: Material): void

    /**
     * @method isLeaf
     * @return {boolean}
     */
    isLeaf(): boolean

    // TODO: Move this to IUnknown
    isZombie(): boolean

    /**
     * @method hasPrincipalScale
     * @param name {string}
     * @return {boolean}
     */
    hasPrincipalScale(name: string): boolean

    /**
     * @method getPrincipalScale
     * @param name {string}
     * @return {number}
     */
    getPrincipalScale(name: string): number

    /**
     * @method setPrincipalScale
     * @param name {string}
     * @param value {number}
     * @return {void}
     */
    setPrincipalScale(name: string, value: number): void
}

export default Geometry
