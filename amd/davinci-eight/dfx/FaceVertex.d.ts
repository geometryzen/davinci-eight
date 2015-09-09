import Face = require('../dfx/Face');
import Vector3 = require('../math/Vector3');
import Vector2 = require('../math/Vector2');
declare class FaceVertex {
    private _parent;
    position: Vector3;
    normal: Vector3;
    coords: Vector2;
    index: number;
    constructor(position: Vector3, normal?: Vector3, coords?: Vector2);
    parent: Face;
}
export = FaceVertex;
