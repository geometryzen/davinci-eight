var expectArg = require('../checks/expectArg');
var isUndefined = require('../checks/isUndefined');
var boxMesh = require('../mesh/boxMesh');
var Symbolic = require('../core/Symbolic');
/**
 * @class BoxBuilder
 */
var BoxBuilder = (function () {
    function BoxBuilder(options) {
        options = options || {};
        this.setWidth(isUndefined(options.width) ? 1 : options.width);
        this.setHeight(isUndefined(options.height) ? 1 : options.height);
        this.setDepth(isUndefined(options.depth) ? 1 : options.depth);
        this.setWidthSegments(isUndefined(options.widthSegments) ? 1 : options.widthSegments);
        this.setHeightSegments(isUndefined(options.heightSegments) ? 1 : options.heightSegments);
        this.setDepthSegments(isUndefined(options.depthSegments) ? 1 : options.depthSegments);
        this.setWireFrame(isUndefined(options.wireFrame) ? false : options.wireFrame);
        this.setPositionVarName(isUndefined(options.positionVarName) ? Symbolic.ATTRIBUTE_POSITION : options.positionVarName);
        this.setNormalVarName(isUndefined(options.normalVarName) ? Symbolic.ATTRIBUTE_NORMAL : options.normalVarName);
    }
    Object.defineProperty(BoxBuilder.prototype, "width", {
        get: function () {
            return this.$width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoxBuilder.prototype, "height", {
        get: function () {
            return this.$height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoxBuilder.prototype, "depth", {
        get: function () {
            return this.$depth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoxBuilder.prototype, "widthSegments", {
        get: function () {
            return this.$widthSegments;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoxBuilder.prototype, "heightSegments", {
        get: function () {
            return this.$heightSegments;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoxBuilder.prototype, "depthSegments", {
        get: function () {
            return this.$depthSegments;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoxBuilder.prototype, "wireFrame", {
        get: function () {
            return this.$wireFrame;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoxBuilder.prototype, "positionVarName", {
        get: function () {
            return this.$positionVarName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoxBuilder.prototype, "normalVarName", {
        get: function () {
            return this.$normalVarName;
        },
        enumerable: true,
        configurable: true
    });
    BoxBuilder.prototype.setWidth = function (width) {
        expectArg('width', width).toBeNumber().toSatisfy(width >= 0, "width must be greater than or equal to zero.");
        this.$width = width;
        return this;
    };
    BoxBuilder.prototype.setHeight = function (height) {
        expectArg('height', height).toBeNumber().toSatisfy(height >= 0, "height must be greater than or equal to zero.");
        this.$height = height;
        return this;
    };
    BoxBuilder.prototype.setDepth = function (depth) {
        expectArg('depth', depth).toBeNumber().toSatisfy(depth >= 0, "depth must be greater than or equal to zero.");
        this.$depth = depth;
        return this;
    };
    BoxBuilder.prototype.setWidthSegments = function (widthSegments) {
        expectArg('widthSegments', widthSegments).toBeNumber().toSatisfy(widthSegments > 0, "widthSegments must be greater than zero.");
        this.$widthSegments = widthSegments;
        return this;
    };
    BoxBuilder.prototype.setHeightSegments = function (heightSegments) {
        expectArg('heightSegments', heightSegments).toBeNumber().toSatisfy(heightSegments > 0, "heightSegments must be greater than zero.");
        this.$heightSegments = heightSegments;
        return this;
    };
    BoxBuilder.prototype.setDepthSegments = function (depthSegments) {
        expectArg('depthSegments', depthSegments).toBeNumber().toSatisfy(depthSegments > 0, "depthSegments must be greater than zero.");
        this.$depthSegments = depthSegments;
        return this;
    };
    BoxBuilder.prototype.setWireFrame = function (wireFrame) {
        expectArg('wireFrame', wireFrame).toBeBoolean();
        this.$wireFrame = wireFrame;
        return this;
    };
    BoxBuilder.prototype.setPositionVarName = function (positionVarName) {
        expectArg('positionVarName', positionVarName).toBeString();
        this.$positionVarName = positionVarName;
        return this;
    };
    BoxBuilder.prototype.setNormalVarName = function (normalVarName) {
        expectArg('normalVarName', normalVarName).toBeString();
        this.$normalVarName = normalVarName;
        return this;
    };
    BoxBuilder.prototype.buildMesh = function (monitor) {
        return boxMesh(monitor, this);
    };
    return BoxBuilder;
})();
module.exports = BoxBuilder;
