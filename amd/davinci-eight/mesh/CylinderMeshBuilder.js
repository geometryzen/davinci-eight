define(["require", "exports", '../mesh/CylinderArgs', '../mesh/cylinderMesh'], function (require, exports, CylinderArgs, cylinderMesh) {
    var CylinderMeshBuilder = (function () {
        function CylinderMeshBuilder(options) {
            this.args = new CylinderArgs(options);
        }
        CylinderMeshBuilder.prototype.setRadiusTop = function (radiusTop) {
            this.args.setRadiusTop(radiusTop);
            return this;
        };
        CylinderMeshBuilder.prototype.setRadiusBottom = function (radiusBottom) {
            this.args.setRadiusBottom(radiusBottom);
            return this;
        };
        CylinderMeshBuilder.prototype.setHeight = function (height) {
            this.args.setHeight(height);
            return this;
        };
        CylinderMeshBuilder.prototype.setRadialSegments = function (radialSegments) {
            this.args.setRadialSegments(radialSegments);
            return this;
        };
        CylinderMeshBuilder.prototype.setHeightSegments = function (heightSegments) {
            this.args.setHeightSegments(heightSegments);
            return this;
        };
        CylinderMeshBuilder.prototype.setOpenEnded = function (openEnded) {
            this.args.setOpenEnded(openEnded);
            return this;
        };
        CylinderMeshBuilder.prototype.setWireFrame = function (wireFrame) {
            this.args.setWireFrame(wireFrame);
            return this;
        };
        CylinderMeshBuilder.prototype.buildMesh = function () {
            return cylinderMesh(this);
        };
        return CylinderMeshBuilder;
    })();
    return CylinderMeshBuilder;
});
