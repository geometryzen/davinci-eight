var CylinderArgs = require('../mesh/CylinderArgs');
var cylinderMesh = require('../mesh/cylinderMesh');
var CylinderMeshBuilder = (function () {
    function CylinderMeshBuilder(options) {
        this.args = new CylinderArgs(options);
    }
    CylinderMeshBuilder.prototype.setHeight = function (height) {
        this.args.setHeight(height);
        return this;
    };
    CylinderMeshBuilder.prototype.setRadiusTop = function (radiusTop) {
        this.args.setRadiusTop(radiusTop);
        return this;
    };
    CylinderMeshBuilder.prototype.setRadiusBottom = function (radiusBottom) {
        this.args.setRadiusBottom(radiusBottom);
        return this;
    };
    CylinderMeshBuilder.prototype.buildMesh = function () {
        return cylinderMesh(this);
    };
    return CylinderMeshBuilder;
})();
module.exports = CylinderMeshBuilder;
