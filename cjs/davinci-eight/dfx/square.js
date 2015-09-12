var quad = require('../dfx/quad');
var Symbolic = require('../core/Symbolic');
var Vector2 = require('../math/Vector2');
var Vector3 = require('../math/Vector3');
// square
//
//  b-------a
//  |       | 
//  |       |
//  |       |
//  c-------d
//
function square(size) {
    if (size === void 0) { size = 1; }
    var s = size / 2;
    var vec0 = new Vector3([+s, +s, 0]);
    var vec1 = new Vector3([-s, +s, 0]);
    var vec2 = new Vector3([-s, -s, 0]);
    var vec3 = new Vector3([+s, -s, 0]);
    var c00 = new Vector2([0, 0]);
    var c01 = new Vector2([0, 1]);
    var c10 = new Vector2([1, 0]);
    var c11 = new Vector2([1, 1]);
    var coords = [c11, c01, c00, c10];
    var attributes = {};
    attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords;
    return quad(vec0, vec1, vec2, vec3, attributes);
}
module.exports = square;
