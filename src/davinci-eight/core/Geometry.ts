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
     *
     */
    draw(material: Material): Geometry;

    /**
     *
     */
    hasPrincipalScale(name: string): boolean

    /**
     *
     */
    getPrincipalScale(name: string): number

    /**
     *
     */
    setPrincipalScale(name: string, value: number): void
}
