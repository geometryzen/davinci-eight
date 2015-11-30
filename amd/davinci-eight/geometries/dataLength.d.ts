import VectorN = require('../math/VectorN');
/**
 * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
 * geometric numbers for vertex attributes, but allows us to extract the vector (grade-1) part?
 */
declare function dataLength(source: VectorN<number>): number;
export = dataLength;
