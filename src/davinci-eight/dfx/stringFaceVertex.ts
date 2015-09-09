import isDefined = require('../checks/isDefined');
import FaceVertex = require('../dfx/FaceVertex');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');

function stringVector3(name: string, vector: Vector3): string {
  return name + vector.x + " " + vector.y + " " + vector.z;
}

function stringVector2(name: string, vector: Vector2): string {
  if (isDefined(vector)) {
    return name + vector.x + " " + vector.y;
  }
  else {
    return name;
  }
}

function stringFaceVertex(faceVertex: FaceVertex): string {
  return stringVector3('P', faceVertex.position) + stringVector3('N', faceVertex.normal) + stringVector2('T', faceVertex.coords);
}

export = stringFaceVertex;
