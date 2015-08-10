import Face3 = require('../core/Face3');
import Sphere = require('../math/Sphere');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
/**
 * @class Geometry
 */
declare class Geometry {
    vertices: Vector3[];
    faces: Face3[];
    faceVertexUvs: Vector2[][][];
    dynamic: boolean;
    verticesNeedUpdate: boolean;
    elementsNeedUpdate: boolean;
    uvsNeedUpdate: boolean;
    boundingSphere: Sphere;
    constructor();
    computeBoundingSphere(): void;
    /**
     * Ensures that the normal property of each face is assigned
     * a value equal to the normalized cross product of two edge vectors
     * taken counter-clockwise. This pseudo vector is then taken to face outwards by convention.
     * @method computeFaceNormals
     */
    computeFaceNormals(): void;
    computeVertexNormals(areaWeighted?: boolean): void;
    mergeVertices(): number;
}
export = Geometry;
