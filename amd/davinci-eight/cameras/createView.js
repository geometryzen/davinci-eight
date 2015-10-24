define(["require", "exports", '../math/Euclidean3', '../math/R3', '../math/Matrix4', '../checks/mustBeNumber', '../checks/mustBeObject', '../core/Symbolic', '../checks/isUndefined', '../cameras/viewMatrix'], function (require, exports, Euclidean3, R3, Matrix4, mustBeNumber, mustBeObject, Symbolic, isUndefined, computeViewMatrix) {
    /**
     * @class createView
     * @constructor
     */
    var createView = function (options) {
        var refCount = 1;
        var eye = new R3();
        var look = new R3();
        var up = R3.copy(Euclidean3.e2);
        var viewMatrix = Matrix4.identity();
        var viewMatrixName = isUndefined(options.viewMatrixName) ? Symbolic.UNIFORM_VIEW_MATRIX : options.viewMatrixName;
        // Force an update of the view matrix.
        eye.modified = true;
        look.modified = true;
        up.modified = true;
        var self = {
            addRef: function () {
                refCount++;
                return refCount;
            },
            release: function () {
                refCount--;
                return refCount;
            },
            get uuid() {
                return "";
            },
            getProperty: function (name) {
                return void 0;
            },
            setProperty: function (name, value) {
            },
            get eye() {
                return eye;
            },
            set eye(value) {
                self.setEye(value);
            },
            /**
             * @method setEye
             * @param eye {R3}
             * @return {View} `this` instance.
             */
            setEye: function (eye_) {
                mustBeObject('eye', eye_);
                eye.x = mustBeNumber('eye.x', eye_.x);
                eye.y = mustBeNumber('eye.y', eye_.y);
                eye.z = mustBeNumber('eye.z', eye_.z);
                return self;
            },
            get look() {
                return look;
            },
            set look(value) {
                self.setLook(value);
            },
            setLook: function (value) {
                mustBeObject('look', value);
                look.x = value.x;
                look.y = value.y;
                look.z = value.z;
                return self;
            },
            get up() {
                return up;
            },
            set up(value) {
                self.setUp(value);
            },
            setUp: function (value) {
                mustBeObject('up', value);
                up.x = value.x;
                up.y = value.y;
                up.z = value.z;
                up.normalize();
                return self;
            },
            setUniforms: function (visitor, canvasId) {
                if (eye.modified || look.modified || up.modified) {
                    // TODO: view matrix would be better.
                    computeViewMatrix(eye, look, up, viewMatrix);
                    eye.modified = false;
                    look.modified = false;
                    up.modified = false;
                }
                visitor.uniformMatrix4(viewMatrixName, false, viewMatrix, canvasId);
            }
        };
        return self;
    };
    return createView;
});
