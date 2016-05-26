import {ContextConsumer} from './ContextConsumer'
import {Material} from './Material'
import Matrix4 from '../math/Matrix4'

/**
 *
 */
export interface Geometry extends ContextConsumer {

    /**
     *
     */
    partsLength: number

    /**
     *
     */
    scaling: Matrix4

    /**
     * @param geometry
     */
    addPart(geometry: Geometry): void

    /**
     * @param index
     */
    removePart(index: number): void

    /**
     * @param index
     * @returns
     */
    getPart(index: number): Geometry

    /**
     * @param material
     */
    draw(material: Material): void

    /**
     * @returns
     */
    isLeaf(): boolean

    // TODO: Move this to Shareable
    isZombie(): boolean

    /**
     * @param name
     * @returns
     */
    hasPrincipalScale(name: string): boolean

    /**
     * @param name
     * @returns
     */
    getPrincipalScale(name: string): number

    /**
     * @param name
     * @param value
     */
    setPrincipalScale(name: string, value: number): void
}
