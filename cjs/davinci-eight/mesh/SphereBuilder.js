var expectArg = require('../checks/expectArg');
var isUndefined = require('../checks/isUndefined');
var sphereMesh = require('../mesh/sphereMesh');
var SphereBuilder = (function () {
    function SphereBuilder(options) {
        options = options || {};
        this.setRadius(isUndefined(options.radius) ? 1 : options.radius);
        this.setPhiStart(isUndefined(options.phiStart) ? 0 : options.phiStart);
        this.setPhiLength(isUndefined(options.phiLength) ? 2 * Math.PI : options.phiLength);
        this.setThetaStart(isUndefined(options.thetaStart) ? 0 : options.thetaStart);
        this.setThetaLength(isUndefined(options.thetaLength) ? Math.PI : options.thetaLength);
        this.setWidthSegments(isUndefined(options.widthSegments) ? 16 : options.widthSegments);
        this.setHeightSegments(isUndefined(options.heightSegments) ? 12 : options.heightSegments);
        this.setWireFrame(isUndefined(options.wireFrame) ? false : options.wireFrame);
    }
    Object.defineProperty(SphereBuilder.prototype, "radius", {
        get: function () {
            return this.$radius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SphereBuilder.prototype, "phiStart", {
        get: function () {
            return this.$phiStart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SphereBuilder.prototype, "phiLength", {
        get: function () {
            return this.$phiLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SphereBuilder.prototype, "thetaStart", {
        get: function () {
            return this.$thetaStart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SphereBuilder.prototype, "thetaLength", {
        get: function () {
            return this.$thetaLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SphereBuilder.prototype, "widthSegments", {
        get: function () {
            return this.$widthSegments;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SphereBuilder.prototype, "heightSegments", {
        get: function () {
            return this.$heightSegments;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SphereBuilder.prototype, "wireFrame", {
        get: function () {
            return this.$wireFrame;
        },
        enumerable: true,
        configurable: true
    });
    SphereBuilder.prototype.setRadius = function (radius) {
        expectArg('radius', radius).toBeNumber().toSatisfy(radius >= 0, "radius must be greater than or equal to zero.");
        this.$radius = radius;
        return this;
    };
    SphereBuilder.prototype.setPhiStart = function (phiStart) {
        expectArg('phiStart', phiStart).toBeNumber();
        this.$phiStart = phiStart;
        return this;
    };
    SphereBuilder.prototype.setPhiLength = function (phiLength) {
        expectArg('phiLength', phiLength).toBeNumber();
        this.$phiLength = phiLength;
        return this;
    };
    SphereBuilder.prototype.setThetaStart = function (thetaStart) {
        expectArg('thetaStart', thetaStart).toBeNumber();
        this.$thetaStart = thetaStart;
        return this;
    };
    SphereBuilder.prototype.setThetaLength = function (thetaLength) {
        expectArg('thetaLength', thetaLength).toBeNumber();
        this.$thetaLength = thetaLength;
        return this;
    };
    SphereBuilder.prototype.setWidthSegments = function (widthSegments) {
        expectArg('widthSegments', widthSegments).toBeNumber().toSatisfy(widthSegments > 0, "widthSegments must be greater than zero.");
        this.$widthSegments = widthSegments;
        return this;
    };
    SphereBuilder.prototype.setHeightSegments = function (heightSegments) {
        expectArg('heightSegments', heightSegments).toBeNumber().toSatisfy(heightSegments > 0, "heightSegments must be greater than zero.");
        this.$heightSegments = heightSegments;
        return this;
    };
    SphereBuilder.prototype.setWireFrame = function (wireFrame) {
        expectArg('wireFrame', wireFrame).toBeBoolean();
        this.$wireFrame = wireFrame;
        return this;
    };
    SphereBuilder.prototype.buildMesh = function (monitor) {
        return sphereMesh(monitor, this);
    };
    return SphereBuilder;
})();
module.exports = SphereBuilder;
