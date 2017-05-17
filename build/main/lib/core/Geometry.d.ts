import { ContextConsumer } from './ContextConsumer';
import { Material } from './Material';
/**
 * Encapsulates one or more buffers and a call to drawArrays or drawElements.
 */
export interface Geometry extends ContextConsumer {
    /**
     * Binds the attributes of the material to the buffers in this Geometry.
     */
    bind(material: Material): void;
    /**
     * Unbinds the attributes of the material from the buffers in this Geometry.
     */
    unbind(material: Material): void;
    /**
     * A call to drawArrays or drawElements.
     */
    draw(): void;
}
