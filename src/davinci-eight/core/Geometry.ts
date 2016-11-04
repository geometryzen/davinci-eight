import { ContextConsumer } from './ContextConsumer';
import { Material } from './Material';

/**
 *
 */
export interface Geometry extends ContextConsumer {
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
     *
     */
    draw(material: Material): void;
}
