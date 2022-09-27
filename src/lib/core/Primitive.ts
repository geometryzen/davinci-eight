import { Attribute } from './Attribute';
import { BeginMode } from './BeginMode';

/**
 * The data corresponding to a drawArrays or drawElements call to the WebGL API.
 * This data is not interleaved.
 */
export interface Primitive {
    /**
     * The mode used to draw the attribute data.
     */
    mode: BeginMode;
    /**
     * Optional indices for the attribute data.
     */
    indices?: number[];
    /**
     * A mapping from attribute name to attribute data.
     */
    attributes: { [name: string]: Attribute };
}
