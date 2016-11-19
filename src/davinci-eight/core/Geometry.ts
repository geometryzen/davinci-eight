import { ContextConsumer } from './ContextConsumer';
import { Facet } from './Facet';
import { Material } from './Material';

/**
 *
 */
export interface Geometry extends Facet, ContextConsumer {
    /**
     * 
     */
    on?(eventName: string, callback: (eventName: string, key: string, value: any, source: Geometry) => void): void;

    /**
     * 
     */
    off?(eventName: string, callback: (eventName: string, key: string, value: any, source: Geometry) => void): void;

    /**
     * 
     */
    bind(material: Material): void;

    /**
     * 
     */
    unbind(material: Material): void;

    /**
     * A call to drawArrays or drawElements.
     */
    draw(): void;
}
