var Point3Geometry = require('../dfx/Point3Geometry');
function makeSingularity() {
    var geometry = new Point3Geometry();
    /*
    let origin = new Vector3([0, 0, 0]);
    let originIndex = geometry.addVertex(origin);
    geometry.addPoint(new Point3(originIndex));
    */
    return geometry;
}
module.exports = makeSingularity;
