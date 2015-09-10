import Face = require('../dfx/Face');
import VectorN = require('../math/VectorN');
declare class FaceVertex {
    private _parent;
    position: VectorN<number>;
    normal: VectorN<number>;
    attributes: {
        [name: string]: VectorN<number>;
    };
    index: number;
    constructor(position: VectorN<number>, normal?: VectorN<number>);
    parent: Face;
}
export = FaceVertex;
