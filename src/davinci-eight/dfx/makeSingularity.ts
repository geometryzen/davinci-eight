import DfxGeometry = require('../dfx/DfxGeometry');
import Point3Geometry = require('../dfx/Point3Geometry');
import Point3 = require('../core/Point3');
import Vector3 = require('../math/Vector3');

function makeSingularity(): DfxGeometry {
  let geometry = new Point3Geometry();
  /*
  let origin = new Vector3([0, 0, 0]);
  let originIndex = geometry.addVertex(origin);
  geometry.addPoint(new Point3(originIndex));
  */
  return geometry;
}

export = makeSingularity;
