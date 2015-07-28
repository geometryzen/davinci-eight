define(["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    var BoxArgs = (function () {
        function BoxArgs() {
            this.$width = 1;
            this.$height = 1;
            this.$depth = 1;
            this.$widthSegments = 1;
            this.$heightSegments = 1;
            this.$depthSegments = 1;
            this.$wireFrame = false;
        }
        Object.defineProperty(BoxArgs.prototype, "width", {
            get: function () {
                return this.$width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxArgs.prototype, "height", {
            get: function () {
                return this.$height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxArgs.prototype, "depth", {
            get: function () {
                return this.$depth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxArgs.prototype, "widthSegments", {
            get: function () {
                return this.$widthSegments;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxArgs.prototype, "heightSegments", {
            get: function () {
                return this.$heightSegments;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxArgs.prototype, "depthSegments", {
            get: function () {
                return this.$depthSegments;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxArgs.prototype, "wireFrame", {
            get: function () {
                return this.$wireFrame;
            },
            enumerable: true,
            configurable: true
        });
        BoxArgs.prototype.setWidth = function (width) {
            expectArg('width', width).toBeNumber().toSatisfy(width >= 0, "width must be greater than or equal to zero.");
            this.$width = width;
            return this;
        };
        BoxArgs.prototype.setHeight = function (height) {
            expectArg('height', height).toBeNumber().toSatisfy(height >= 0, "height must be greater than or equal to zero.");
            this.$height = height;
            return this;
        };
        BoxArgs.prototype.setDepth = function (depth) {
            expectArg('depth', depth).toBeNumber().toSatisfy(depth >= 0, "depth must be greater than or equal to zero.");
            this.$depth = depth;
            return this;
        };
        BoxArgs.prototype.setWidthSegments = function (widthSegments) {
            expectArg('widthSegments', widthSegments).toBeNumber().toSatisfy(widthSegments > 0, "widthSegments must be greater than zero.");
            this.$widthSegments = widthSegments;
            return this;
        };
        BoxArgs.prototype.setHeightSegments = function (heightSegments) {
            expectArg('heightSegments', heightSegments).toBeNumber().toSatisfy(heightSegments > 0, "heightSegments must be greater than zero.");
            this.$heightSegments = heightSegments;
            return this;
        };
        BoxArgs.prototype.setDepthSegments = function (depthSegments) {
            expectArg('depthSegments', depthSegments).toBeNumber().toSatisfy(depthSegments > 0, "depthSegments must be greater than zero.");
            this.$depthSegments = depthSegments;
            return this;
        };
        BoxArgs.prototype.setWireFrame = function (wireFrame) {
            this.$wireFrame = wireFrame;
            return this;
        };
        return BoxArgs;
    })();
    return BoxArgs;
});
