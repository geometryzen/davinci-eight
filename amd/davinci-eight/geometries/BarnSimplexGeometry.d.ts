import SimplexGeometry = require('../geometries/SimplexGeometry');
import MutableVectorE3 = require('../math/MutableVectorE3');
/**
 * @module EIGHT
 * @submodule geometries
 * @class BarnSimplexGeometry
 */
declare class BarnSimplexGeometry extends SimplexGeometry {
    a: MutableVectorE3;
    b: MutableVectorE3;
    c: MutableVectorE3;
    /**
     * The basic barn similar to that described in "Computer Graphics using OpenGL", by Hill and Kelly.
     * Ten (10) vertices are used to define the barn.
     * The floor vertices are lablled 0, 1, 6, 5.
     * The corresponding ceiling vertices are labelled 4, 2, 7, 9.
     * The roof peak vertices are labelled 3, 8.
     * @class BarnSimplexGeometry
     * @constructor
     */
    constructor();
    protected destructor(): void;
    isModified(): boolean;
    setModified(modified: boolean): BarnSimplexGeometry;
    regenerate(): void;
}
export = BarnSimplexGeometry;
