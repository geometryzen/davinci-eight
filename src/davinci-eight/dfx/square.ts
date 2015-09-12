import Simplex = require('../dfx/Simplex');
import quad = require('../dfx/quad');
import Symbolic = require('../core/Symbolic');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');

// square
//  v1------v0
//  |       | 
//  |       |
//  |       |
//  v2------v3
//
function square(): Simplex[] {

    let vec0 = new Vector3([+1, +1, 0]);
    let vec1 = new Vector3([-1, +1, 0]);
    let vec2 = new Vector3([-1, -1, 0]);
    let vec3 = new Vector3([+1, -1, 0]);

    let c00 = new Vector2([0, 0]);
    let c01 = new Vector2([0, 1]);
    let c10 = new Vector2([1, 0]);
    let c11 = new Vector2([1, 1]);

    let coords: Vector2[] = [c11, c01, c00, c10];
    
    return quad([vec0,vec1,vec2,vec3], coords);
}

export = square;