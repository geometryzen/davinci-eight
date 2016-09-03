import {ContextConsumer} from './ContextConsumer';
import {Material} from './Material';

/**
 *
 */
export interface Geometry extends ContextConsumer {

    /**
     * 
     */
    bind(material: Material): void;

    /**
     * 
     */
    unbind(material: Material): void;

    /**
     *
     */
    draw(material: Material): void;
}
