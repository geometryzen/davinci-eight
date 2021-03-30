import { Attribute } from './Attribute';
/**
 * Computes the stride for a given collection of attributes.
 * @hidden
 */
export declare function computeStride(attributes: {
    [name: string]: Attribute;
}, aNames: string[]): number;
