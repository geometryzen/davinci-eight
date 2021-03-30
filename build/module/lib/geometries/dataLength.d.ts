import { VectorN } from '../atoms/VectorN';
import { AttributeSizeType } from '../core/AttributeSizeType';
/**
 * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
 * geometric numbers for vertex attributes, but allows us to extract the vector (grade-1) part?
 * @hidden
 */
export declare function dataLength(source: VectorN<number>): AttributeSizeType;
