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
    /**
     * Determines how the length of the axis (vector) affects the scaling.
     * Returns a bitwise-or of 001, 010, and 100 according to the directions affected.
     * 001 (1) corresponds to e1.
     * 010 (2) corresponds to e2.
     * 100 (4) corresponds to e3;
     */
    getScalingForAxis(): number;
}

export default Geometry;
