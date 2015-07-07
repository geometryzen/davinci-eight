import Face3 = require('../core/Face3');
import Sphere = require('../math/Sphere');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
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
    computeFaceNormals(): void;
    computeVertexNormals(areaWeighted?: boolean): void;
}
export = Geometry;
