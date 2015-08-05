var expectArg = require('../checks/expectArg');
var isUndefined = require('../checks/isUndefined');
var cylinderMesh = require('../mesh/cylinderMesh');
var Vector3 = require('../math/Vector3');
/**
 * @class CylinderBuilder
 */
var CylinderBuilder = (function () {
    function CylinderBuilder(options) {
        this.$axis = Vector3.e3.clone();
        options = options || { modelMatrix: 'uModelMatrix' };
        this.setRadiusTop(isUndefined(options.radiusTop) ? 1 : options.radiusTop);
        this.setRadiusBottom(isUndefined(options.radiusBottom) ? 1 : options.radiusBottom);
        //    this.setHeight(isUndefined(options.height) ? 1 : options.height);
        //    this.setDepth(isUndefined(options.depth) ? 1 : options.depth);
        //    this.setWidthSegments(isUndefined(options.widthSegments) ? 1 : options.widthSegments);
        //    this.setHeightSegments(isUndefined(options.heightSegments) ? 1 : options.heightSegments);
        //    this.setDepthSegments(isUndefined(options.depthSegments) ? 1 : options.depthSegments);
        this.setWireFrame(isUndefined(options.wireFrame) ? false : options.wireFrame);
    }
    Object.defineProperty(CylinderBuilder.prototype, "radiusTop", {
        get: function () {
            return this.$radiusTop;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CylinderBuilder.prototype, "radiusBottom", {
        get: function () {
            return this.$radiusBottom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CylinderBuilder.prototype, "height", {
        get: function () {
            return this.$height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CylinderBuilder.prototype, "axis", {
        get: function () {
            return this.$axis;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CylinderBuilder.prototype, "depth", {
        get: function () {
            return this.$depth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CylinderBuilder.prototype, "widthSegments", {
        get: function () {
            return this.$widthSegments;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CylinderBuilder.prototype, "heightSegments", {
        get: function () {
            return this.$heightSegments;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CylinderBuilder.prototype, "depthSegments", {
        get: function () {
            return this.$depthSegments;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CylinderBuilder.prototype, "wireFrame", {
        get: function () {
            return this.$wireFrame;
        },
        enumerable: true,
        configurable: true
    });
    CylinderBuilder.prototype.setRadiusTop = function (radiusTop) {
        expectArg('radiusTop', radiusTop).toBeNumber().toSatisfy(radiusTop >= 0, "radiusTop must be greater than or equal to zero.");
        this.$radiusTop = radiusTop;
        return this;
    };
    CylinderBuilder.prototype.setRadiusBottom = function (radiusBottom) {
        expectArg('radiusBottom', radiusBottom).toBeNumber().toSatisfy(radiusBottom >= 0, "radiusBottom must be greater than or equal to zero.");
        this.$radiusBottom = radiusBottom;
        return this;
    };
    CylinderBuilder.prototype.setHeight = function (height) {
        expectArg('height', height).toBeNumber().toSatisfy(height >= 0, "height must be greater than or equal to zero.");
        this.$height = height;
        return this;
    };
    CylinderBuilder.prototype.setAxis = function (axis) {
        expectArg('axis', axis).toBeObject();
        this.$axis.copy(axis);
        return this;
    };
    CylinderBuilder.prototype.setDepth = function (depth) {
        expectArg('depth', depth).toBeNumber().toSatisfy(depth >= 0, "depth must be greater than or equal to zero.");
        this.$depth = depth;
        return this;
    };
    CylinderBuilder.prototype.setWidthSegments = function (widthSegments) {
        expectArg('widthSegments', widthSegments).toBeNumber().toSatisfy(widthSegments > 0, "widthSegments must be greater than zero.");
        this.$widthSegments = widthSegments;
        return this;
    };
    CylinderBuilder.prototype.setHeightSegments = function (heightSegments) {
        expectArg('heightSegments', heightSegments).toBeNumber().toSatisfy(heightSegments > 0, "heightSegments must be greater than zero.");
        this.$heightSegments = heightSegments;
        return this;
    };
    CylinderBuilder.prototype.setDepthSegments = function (depthSegments) {
        expectArg('depthSegments', depthSegments).toBeNumber().toSatisfy(depthSegments > 0, "depthSegments must be greater than zero.");
        this.$depthSegments = depthSegments;
        return this;
    };
    CylinderBuilder.prototype.setWireFrame = function (wireFrame) {
        expectArg('wireFrame', wireFrame).toBeBoolean();
        this.$wireFrame = wireFrame;
        return this;
    };
    CylinderBuilder.prototype.buildMesh = function () {
        return cylinderMesh(this);
    };
    return CylinderBuilder;
})();
module.exports = CylinderBuilder;
