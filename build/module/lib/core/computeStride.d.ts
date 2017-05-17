import { Attribute } from './Attribute';
/**
 * Computes the stride for a given collection of attributes.
 */
export declare function computeStride(attributes: {
    [name: string]: Attribute;
}, aNames: string[]): number;
