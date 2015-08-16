var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../mesh/CylinderArgs', '../mesh/cylinderMesh'], function (require, exports, CylinderArgs, cylinderMesh) {
    var CylinderMeshBuilder = (function (_super) {
        __extends(CylinderMeshBuilder, _super);
        function CylinderMeshBuilder(options) {
            _super.call(this, options);
        }
        CylinderMeshBuilder.prototype.setRadiusTop = function (radiusTop) {
            _super.prototype.setRadiusTop.call(this, radiusTop);
            return this;
        };
        CylinderMeshBuilder.prototype.setRadiusBottom = function (radiusBottom) {
            _super.prototype.setRadiusBottom.call(this, radiusBottom);
            return this;
        };
        CylinderMeshBuilder.prototype.setHeight = function (height) {
            _super.prototype.setHeight.call(this, height);
            return this;
        };
        CylinderMeshBuilder.prototype.setRadialSegments = function (radialSegments) {
            _super.prototype.setRadialSegments.call(this, radialSegments);
            return this;
        };
        CylinderMeshBuilder.prototype.setHeightSegments = function (heightSegments) {
            _super.prototype.setHeightSegments.call(this, heightSegments);
            return this;
        };
        CylinderMeshBuilder.prototype.setOpenEnded = function (openEnded) {
            _super.prototype.setOpenEnded.call(this, openEnded);
            return this;
        };
        CylinderMeshBuilder.prototype.setThetaStart = function (thetaStart) {
            _super.prototype.setThetaStart.call(this, thetaStart);
            return this;
        };
        CylinderMeshBuilder.prototype.setThetaLength = function (thetaLength) {
            _super.prototype.setThetaLength.call(this, thetaLength);
            return this;
        };
        CylinderMeshBuilder.prototype.setWireFrame = function (wireFrame) {
            _super.prototype.setWireFrame.call(this, wireFrame);
            return this;
        };
        CylinderMeshBuilder.prototype.buildMesh = function () {
            return cylinderMesh(this);
        };
        return CylinderMeshBuilder;
    })(CylinderArgs);
    return CylinderMeshBuilder;
});
