define(["require", "exports", '../checks/isDefined'], function (require, exports, isDefined) {
    function stringVectorN(name, vector) {
        if (isDefined(vector)) {
            return name + vector.toString();
        }
        else {
            return name;
        }
    }
    function stringFaceVertex(faceVertex) {
        var attributes = faceVertex.attributes;
        var attribsKey = Object.keys(attributes).map(function (name) {
            var vector = attributes[name];
            return stringVectorN(name, vector);
        }).join(' ');
        return stringVectorN('P', faceVertex.position) + stringVectorN('N', faceVertex.normal) + attribsKey;
    }
    return stringFaceVertex;
});
