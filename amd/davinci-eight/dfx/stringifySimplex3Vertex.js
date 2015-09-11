define(["require", "exports", '../checks/isDefined'], function (require, exports, isDefined) {
    function stringVectorN(name, vector) {
        if (isDefined(vector)) {
            return name + vector.toString();
        }
        else {
            return name;
        }
    }
    function stringifySimplex3Vertex(vertex) {
        var attributes = vertex.attributes;
        var attribsKey = Object.keys(attributes).map(function (name) {
            var vector = attributes[name];
            return stringVectorN(name, vector);
        }).join(' ');
        return stringVectorN('P', vertex.position) + stringVectorN('N', vertex.normal) + attribsKey;
    }
    return stringifySimplex3Vertex;
});
