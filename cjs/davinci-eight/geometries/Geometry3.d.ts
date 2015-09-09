import Cartesian2 = require('../math/Cartesian2');
import Cartesian3 = require('../math/Cartesian3');
import Face3 = require('../core/Face3');
import Sphere = require('../math/Sphere');
/**
 * @class Geometry3
 */
declare class Geometry3 {
    vertices: Cartesian3[];
    faces: Face3[];
    faceVertexUvs: Cartesian2[][][];
    dynamic: boolean;
    verticesNeedUpdate: boolean;
    elementsNeedUpdate: boolean;
    uvsNeedUpdate: boolean;
    boundingSphere: Sphere;
    constructor();
    protected computeBoundingSphere(): void;
    /**
     * Ensures that the normal property of each face is assigned
     * a value equal to the normalized cross product of two edge vectors
     * taken counter-clockwise. This pseudo vector is then taken to face outwards by convention.
     * @method computeFaceNormals
     */
    protected computeFaceNormals(): void;
    protected computeVertexNormals(areaWeighted?: boolean): void;
    /**
     * Updates the geometry by merging closely separated vertices.
     * @method mergeVertices
     * @param precisionPoints {number} number of decimal points, eg. 4 for epsilon of 0.0001
     */
    protected mergeVertices(precisionPoints?: number): number;
}
export = Geometry3;
