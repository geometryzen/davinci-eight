import { Attribute } from './Attribute';
import { VertexAttribPointer } from './VertexAttribPointer';
/**
 * @deprecated
 */
export declare function computePointers(attributes: {
    [name: string]: Attribute;
}, aNames: string[]): VertexAttribPointer[];
