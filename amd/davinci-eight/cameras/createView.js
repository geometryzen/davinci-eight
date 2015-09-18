define(["require", "exports", '../math/Vector3', '../math/Matrix4', '../core/Symbolic', '../checks/expectArg', '../checks/isUndefined', '../cameras/viewMatrix'], function (require, exports, Vector3, Matrix4, Symbolic, expectArg, isUndefined, computeViewMatrix) {
    /**
     * @class createView
     * @constructor
     */
    var createView = function (options) {
        var eye = new Vector3();
        var look = new Vector3();
        var up = Vector3.e2;
        var viewMatrix = Matrix4.identity();
        var viewMatrixName = isUndefined(options.viewMatrixName) ? Symbolic.UNIFORM_VIEW_MATRIX : options.viewMatrixName;
        // Force an update of the view matrix.
        eye.modified = true;
        look.modified = true;
        up.modified = true;
        var self = {
            get eye() {
                return eye;
            },
            set eye(value) {
                self.setEye(value);
            },
            setEye: function (value) {
                expectArg('eye', value).toBeObject();
                eye.x = value.x;
                eye.y = value.y;
                eye.z = value.z;
                return self;
            },
            get look() {
                return look;
            },
            set look(value) {
                self.setLook(value);
            },
            setLook: function (value) {
                expectArg('look', value).toBeObject();
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
                expectArg('up', value).toBeObject();
                up.x = value.x;
                up.y = value.y;
                up.z = value.z;
                up.normalize();
                return self;
            },
            accept: function (visitor) {
                if (eye.modified || look.modified || up.modified) {
                    // TODO: view matrix would be better.
                    computeViewMatrix(eye, look, up, viewMatrix);
                    eye.modified = false;
                    look.modified = false;
                    up.modified = false;
                }
                visitor.uniformMatrix4(viewMatrixName, false, viewMatrix);
            }
        };
        return self;
    };
    return createView;
});
