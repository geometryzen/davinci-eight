define(["require", "exports", '../math/Euclidean3', '../math/R3', '../math/Mat4R', '../checks/mustBeNumber', '../checks/mustBeObject', '../core/GraphicsProgramSymbols', '../checks/isUndefined', '../cameras/viewMatrix'], function (require, exports, Euclidean3_1, R3_1, Mat4R_1, mustBeNumber_1, mustBeObject_1, GraphicsProgramSymbols_1, isUndefined_1, viewMatrix_1) {
    function createView(options) {
        var refCount = 1;
        var eye = new R3_1.default();
        var look = new R3_1.default();
        var up = R3_1.default.copy(Euclidean3_1.default.e2);
        var viewMatrix = Mat4R_1.default.one();
        var viewMatrixName = isUndefined_1.default(options.viewMatrixName) ? GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX : options.viewMatrixName;
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
                return self;
            },
            get eye() {
                return eye;
            },
            set eye(value) {
                self.setEye(value);
            },
            setEye: function (eye_) {
                mustBeObject_1.default('eye', eye_);
                eye.x = mustBeNumber_1.default('eye.x', eye_.x);
                eye.y = mustBeNumber_1.default('eye.y', eye_.y);
                eye.z = mustBeNumber_1.default('eye.z', eye_.z);
                return self;
            },
            get look() {
                return look;
            },
            set look(value) {
                self.setLook(value);
            },
            setLook: function (value) {
                mustBeObject_1.default('look', value);
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
                mustBeObject_1.default('up', value);
                up.x = value.x;
                up.y = value.y;
                up.z = value.z;
                up.direction();
                return self;
            },
            setUniforms: function (visitor) {
                if (eye.modified || look.modified || up.modified) {
                    viewMatrix_1.default(eye, look, up, viewMatrix);
                    eye.modified = false;
                    look.modified = false;
                    up.modified = false;
                }
                visitor.mat4(viewMatrixName, viewMatrix, false);
            }
        };
        return self;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createView;
});
