var expectArg = require('../checks/expectArg');
var Symbolic = require('../core/Symbolic');
function stringVectorN(name, vector) {
    if (vector) {
        return name + vector.toString();
    }
    else {
        return name;
    }
}
function stringifyVertex(vertex) {
    var attributes = vertex.attributes;
    var attribsKey = Object.keys(attributes).map(function (name) {
        var vector = attributes[name];
        return stringVectorN(name, vector);
    }).join(' ');
    //  return stringVectorN('P', vertex.position) + attribsKey;
    return attribsKey;
}
var Vertex = (function () {
    function Vertex(position) {
        //  public position: VectorN<number>;
        this.attributes = {};
        expectArg('position', position).toBeObject();
        this.attributes[Symbolic.ATTRIBUTE_POSITION] = position;
        //  this.position = position;
    }
    Vertex.prototype.toString = function () {
        return stringifyVertex(this);
    };
    return Vertex;
})();
module.exports = Vertex;
