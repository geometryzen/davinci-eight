import { Attribute } from '../core/Attribute';
import { BeginMode } from '../core/BeginMode';
import { Primitive } from '../core/Primitive';
/**
 * A convenience class for implementing the Primitive interface.
 */
export declare class DrawPrimitive implements Primitive {
    mode: BeginMode;
    indices: number[];
    attributes: {
        [name: string]: Attribute;
    };
    constructor(mode: BeginMode, indices: number[], attributes: {
        [name: string]: Attribute;
    });
}
