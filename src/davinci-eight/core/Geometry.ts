import IContextConsumer from './IContextConsumer'
import IMaterial from './IMaterial'

/**
 * @class Geometry
 */
interface Geometry extends IContextConsumer {
    /**
     * @property partsLength
     * @type number
     * @readOnly
     */
    partsLength: number

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
     * @param material {IMaterial}
     * @return {void}
     */
    draw(material: IMaterial): void

    /**
     * @method isLeaf
     * @return {boolean}
     */
    isLeaf(): boolean

    // TODO: Move this to IUnknown
    isZombie(): boolean
}

export default Geometry
