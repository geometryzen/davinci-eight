define(["require", "exports", '../checks/expectArg', '../checks/isUndefined', '../math/Vector3'], function (require, exports, expectArg, isUndefined, Vector3) {
    /**
     * @class CylinderArgs
     */
    var CylinderArgs = (function () {
        function CylinderArgs(options) {
            if (options === void 0) { options = {}; }
            this.$axis = Vector3.e3.clone();
            this.setRadiusTop(isUndefined(options.radiusTop) ? 1 : options.radiusTop);
            this.setRadiusBottom(isUndefined(options.radiusBottom) ? 1 : options.radiusBottom);
            this.setHeight(isUndefined(options.height) ? 1 : options.height);
            this.setRadialSegments(isUndefined(options.radialSegments) ? 16 : options.radialSegments);
            this.setHeightSegments(isUndefined(options.heightSegments) ? 1 : options.heightSegments);
            this.setOpenEnded(isUndefined(options.openEnded) ? false : options.openEnded);
            this.setThetaStart(isUndefined(options.thetaStart) ? 0 : options.thetaStart);
            this.setThetaLength(isUndefined(options.thetaLength) ? 2 * Math.PI : options.thetaLength);
            this.setWireFrame(isUndefined(options.wireFrame) ? false : options.wireFrame);
        }
        Object.defineProperty(CylinderArgs.prototype, "radiusTop", {
            get: function () {
                return this.$radiusTop;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "radiusBottom", {
            get: function () {
                return this.$radiusBottom;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "height", {
            get: function () {
                return this.$height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "radialSegments", {
            get: function () {
                return this.$radialSegments;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "heightSegments", {
            get: function () {
                return this.$heightSegments;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "openEnded", {
            get: function () {
                return this.$openEnded;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "thetaStart", {
            get: function () {
                return this.$thetaStart;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "thetaLength", {
            get: function () {
                return this.$thetaLength;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "wireFrame", {
            get: function () {
                return this.$wireFrame;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "axis", {
            get: function () {
                return this.$axis;
            },
            enumerable: true,
            configurable: true
        });
        CylinderArgs.prototype.setRadiusTop = function (radiusTop) {
            expectArg('radiusTop', radiusTop).toBeNumber().toSatisfy(radiusTop >= 0, "radiusTop must be greater than or equal to zero.");
            this.$radiusTop = radiusTop;
            return this;
        };
        CylinderArgs.prototype.setRadiusBottom = function (radiusBottom) {
            expectArg('radiusBottom', radiusBottom).toBeNumber().toSatisfy(radiusBottom >= 0, "radiusBottom must be greater than or equal to zero.");
            this.$radiusBottom = radiusBottom;
            return this;
        };
        CylinderArgs.prototype.setHeight = function (height) {
            expectArg('height', height).toBeNumber().toSatisfy(height >= 0, "height must be greater than or equal to zero.");
            this.$height = height;
            return this;
        };
        CylinderArgs.prototype.setRadialSegments = function (radialSegments) {
            expectArg('radialSegments', radialSegments).toBeNumber();
            this.$radialSegments = radialSegments;
            return this;
        };
        CylinderArgs.prototype.setHeightSegments = function (heightSegments) {
            expectArg('heightSegments', heightSegments).toBeNumber();
            this.$heightSegments = heightSegments;
            return this;
        };
        CylinderArgs.prototype.setOpenEnded = function (openEnded) {
            expectArg('openEnded', openEnded).toBeBoolean();
            this.$openEnded = openEnded;
            return this;
        };
        CylinderArgs.prototype.setThetaStart = function (thetaStart) {
            expectArg('thetaStart', thetaStart).toBeNumber();
            this.$thetaStart = thetaStart;
            return this;
        };
        CylinderArgs.prototype.setThetaLength = function (thetaLength) {
            expectArg('thetaLength', thetaLength).toBeNumber();
            this.$thetaLength = thetaLength;
            return this;
        };
        CylinderArgs.prototype.setWireFrame = function (wireFrame) {
            expectArg('wireFrame', wireFrame).toBeBoolean();
            this.$wireFrame = wireFrame;
            return this;
        };
        CylinderArgs.prototype.setAxis = function (axis) {
            expectArg('axis', axis).toBeObject();
            this.$axis.copy(axis);
            return this;
        };
        return CylinderArgs;
    })();
    return CylinderArgs;
});
