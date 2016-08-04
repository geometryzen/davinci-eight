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
    scaling: Matrix4

    /**
     * 
     */
    bind(material: Material): Geometry;

    /**
     * 
     */
    unbind(material: Material): Geometry;

    /**
     * @param material
     */
    draw(material: Material): Geometry;

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
