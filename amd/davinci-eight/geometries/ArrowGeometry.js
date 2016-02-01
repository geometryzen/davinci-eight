var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/ConeGeometry', '../geometries/CylinderGeometry', '../geometries/AxialGeometry', '../geometries/RingGeometry', '../math/R3'], function (require, exports, ConeGeometry_1, CylinderGeometry_1, AxialGeometry_1, RingGeometry_1, R3_1) {
    var ArrowGeometry = (function (_super) {
        __extends(ArrowGeometry, _super);
        function ArrowGeometry(axis, sliceStart) {
            _super.call(this, axis, sliceStart);
            this.heightCone = 0.20;
            this.radiusCone = 0.08;
            this.radiusShaft = 0.01;
            this.thetaSegments = 16;
        }
        ArrowGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        ArrowGeometry.prototype.setAxis = function (axis) {
            _super.prototype.setAxis.call(this, axis);
            return this;
        };
        ArrowGeometry.prototype.toPrimitives = function () {
            var heightShaft = 1 - this.heightCone;
            var back = R3_1.default.copy(this.axis).scale(-1);
            var neck = R3_1.default.copy(this.axis).scale(heightShaft).add(this.position);
            var tail = R3_1.default.copy(this.position);
            var cone = new ConeGeometry_1.default(this.axis, this.sliceStart);
            cone.radius = this.radiusCone;
            cone.height = this.heightCone;
            cone.setPosition(neck);
            cone.axis = this.axis;
            cone.sliceAngle = this.sliceAngle;
            cone.thetaSegments = this.thetaSegments;
            cone.useTextureCoords = this.useTextureCoords;
            var disc = new RingGeometry_1.default(back, this.sliceStart);
            disc.innerRadius = this.radiusShaft;
            disc.outerRadius = this.radiusCone;
            disc.setPosition(neck);
            disc.sliceAngle = -this.sliceAngle;
            disc.thetaSegments = this.thetaSegments;
            disc.useTextureCoords = this.useTextureCoords;
            var shaft = new CylinderGeometry_1.default(this.axis, this.sliceStart);
            shaft.radius = this.radiusShaft;
            shaft.height = heightShaft;
            shaft.setPosition(tail);
            shaft.sliceAngle = this.sliceAngle;
            shaft.thetaSegments = this.thetaSegments;
            shaft.useTextureCoords = this.useTextureCoords;
            var plug = new RingGeometry_1.default(back, this.sliceStart);
            plug.innerRadius = 0;
            plug.outerRadius = this.radiusShaft;
            plug.setPosition(tail);
            plug.sliceAngle = -this.sliceAngle;
            plug.thetaSegments = this.thetaSegments;
            plug.useTextureCoords = this.useTextureCoords;
            return [cone.toPrimitives(), disc.toPrimitives(), shaft.toPrimitives(), plug.toPrimitives()].reduce(function (a, b) { return a.concat(b); }, []);
        };
        ArrowGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return ArrowGeometry;
    })(AxialGeometry_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ArrowGeometry;
});
