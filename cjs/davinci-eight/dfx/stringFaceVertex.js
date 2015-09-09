var isDefined = require('../checks/isDefined');
function stringVector3(name, vector) {
    return name + vector.x + " " + vector.y + " " + vector.z;
}
function stringVector2(name, vector) {
    if (isDefined(vector)) {
        return name + vector.x + " " + vector.y;
    }
    else {
        return name;
    }
}
function stringFaceVertex(faceVertex) {
    return stringVector3('P', faceVertex.position) + stringVector3('N', faceVertex.normal) + stringVector2('T', faceVertex.coords);
}
module.exports = stringFaceVertex;
