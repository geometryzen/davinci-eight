import Face3 = require('../core/Face3');
import Vector3 = require('../math/Vector3');
declare class Geometry {
    vertices: Vector3[];
    verticesNeedUpdate: boolean;
    faces: Face3[];
    elementsNeedUpdate: boolean;
    constructor();
    computeBoundingSphere(): void;
}
export = Geometry;
