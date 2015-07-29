var expectArg = require('../checks/expectArg');
var isUndefined = require('../checks/isUndefined');
var arrowMesh = require('../mesh/arrowMesh');
var Vector3 = require('../math/Vector3');
/**
 * @class ArrowBuilder
 */
var ArrowBuilder = (function () {
    function ArrowBuilder(options) {
        this.$axis = Vector3.e3.clone();
        options = options || {};
        //    this.setWidth(isUndefined(options.width) ? 1 : options.width);
        //    this.setHeight(isUndefined(options.height) ? 1 : options.height);
        //    this.setDepth(isUndefined(options.depth) ? 1 : options.depth);
        //    this.setWidthSegments(isUndefined(options.widthSegments) ? 1 : options.widthSegments);
        //    this.setHeightSegments(isUndefined(options.heightSegments) ? 1 : options.heightSegments);
        //    this.setDepthSegments(isUndefined(options.depthSegments) ? 1 : options.depthSegments);
        this.setWireFrame(isUndefined(options.wireFrame) ? false : options.wireFrame);
    }
    Object.defineProperty(ArrowBuilder.prototype, "axis", {
        get: function () {
            return this.$axis;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrowBuilder.prototype, "height", {
        get: function () {
            return this.$height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrowBuilder.prototype, "depth", {
        get: function () {
            return this.$depth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrowBuilder.prototype, "widthSegments", {
        get: function () {
            return this.$widthSegments;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrowBuilder.prototype, "heightSegments", {
        get: function () {
            return this.$heightSegments;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrowBuilder.prototype, "depthSegments", {
        get: function () {
            return this.$depthSegments;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrowBuilder.prototype, "wireFrame", {
        get: function () {
            return this.$wireFrame;
        },
        enumerable: true,
        configurable: true
    });
    ArrowBuilder.prototype.setAxis = function (axis) {
        expectArg('axis', axis).toBeObject();
        this.$axis.copy(axis);
        return this;
    };
    ArrowBuilder.prototype.setHeight = function (height) {
        expectArg('height', height).toBeNumber().toSatisfy(height >= 0, "height must be greater than or equal to zero.");
        this.$height = height;
        return this;
    };
    ArrowBuilder.prototype.setDepth = function (depth) {
        expectArg('depth', depth).toBeNumber().toSatisfy(depth >= 0, "depth must be greater than or equal to zero.");
        this.$depth = depth;
        return this;
    };
    ArrowBuilder.prototype.setWidthSegments = function (widthSegments) {
        expectArg('widthSegments', widthSegments).toBeNumber().toSatisfy(widthSegments > 0, "widthSegments must be greater than zero.");
        this.$widthSegments = widthSegments;
        return this;
    };
    ArrowBuilder.prototype.setHeightSegments = function (heightSegments) {
        expectArg('heightSegments', heightSegments).toBeNumber().toSatisfy(heightSegments > 0, "heightSegments must be greater than zero.");
        this.$heightSegments = heightSegments;
        return this;
    };
    ArrowBuilder.prototype.setDepthSegments = function (depthSegments) {
        expectArg('depthSegments', depthSegments).toBeNumber().toSatisfy(depthSegments > 0, "depthSegments must be greater than zero.");
        this.$depthSegments = depthSegments;
        return this;
    };
    ArrowBuilder.prototype.setWireFrame = function (wireFrame) {
        expectArg('wireFrame', wireFrame).toBeBoolean();
        this.$wireFrame = wireFrame;
        return this;
    };
    ArrowBuilder.prototype.buildMesh = function () {
        return arrowMesh(this);
    };
    return ArrowBuilder;
})();
module.exports = ArrowBuilder;
