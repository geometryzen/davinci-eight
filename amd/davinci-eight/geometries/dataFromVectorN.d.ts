import VectorN = require('../math/VectorN');
/**
 * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
 * geometric numbers fo vertex attributes, but allows us to extract the vector (grade-1) part?
 */
declare function dataFromVectorN(source: VectorN<number>): number[];
export = dataFromVectorN;
