define(["require", "exports", '../cameras/createView', '../math/Mat4R', '../core/GraphicsProgramSymbols', '../math/R1', '../checks/isUndefined', '../checks/mustBeNumber', '../cameras/perspectiveMatrix'], function (require, exports, createView_1, Mat4R_1, GraphicsProgramSymbols_1, R1_1, isUndefined_1, mustBeNumber_1, perspectiveMatrix_1) {
    function createPerspective(options) {
        options = options || {};
        var fov = new R1_1.default([isUndefined_1.default(options.fov) ? 75 * Math.PI / 180 : options.fov]);
        var aspect = new R1_1.default([isUndefined_1.default(options.aspect) ? 1 : options.aspect]);
        var near = new R1_1.default([isUndefined_1.default(options.near) ? 0.1 : options.near]);
        var far = new R1_1.default([mustBeNumber_1.default('options.far', isUndefined_1.default(options.far) ? 2000 : options.far)]);
        var projectionMatrixName = isUndefined_1.default(options.projectionMatrixName) ? GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX : options.projectionMatrixName;
        var refCount = 1;
        var base = createView_1.default(options);
        var projectionMatrix = Mat4R_1.default.one();
        var matrixNeedsUpdate = true;
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
                return base.eye;
            },
            set eye(eye) {
                base.eye = eye;
            },
            setEye: function (eye) {
                base.setEye(eye);
                return self;
            },
            get look() {
                return base.look;
            },
            set look(value) {
                base.look = value;
            },
            setLook: function (look) {
                base.setLook(look);
                return self;
            },
            get up() {
                return base.up;
            },
            set up(value) {
                base.up = value;
            },
            setUp: function (up) {
                base.setUp(up);
                return self;
            },
            get fov() {
                return fov.x;
            },
            set fov(value) {
                self.setFov(value);
            },
            setFov: function (value) {
                mustBeNumber_1.default('fov', value);
                matrixNeedsUpdate = matrixNeedsUpdate || fov.x !== value;
                fov.x = value;
                return self;
            },
            get aspect() {
                return aspect.x;
            },
            set aspect(value) {
                self.setAspect(value);
            },
            setAspect: function (value) {
                mustBeNumber_1.default('aspect', value);
                matrixNeedsUpdate = matrixNeedsUpdate || aspect.x !== value;
                aspect.x = value;
                return self;
            },
            get near() {
                return near.x;
            },
            set near(value) {
                self.setNear(value);
            },
            setNear: function (value) {
                if (value !== near.x) {
                    near.x = value;
                    matrixNeedsUpdate = true;
                }
                return self;
            },
            get far() {
                return far.x;
            },
            set far(value) {
                self.setFar(value);
            },
            setFar: function (value) {
                if (value !== far.x) {
                    far.x = value;
                    matrixNeedsUpdate = true;
                }
                return self;
            },
            setUniforms: function (visitor) {
                if (matrixNeedsUpdate) {
                    perspectiveMatrix_1.default(fov.x, aspect.x, near.x, far.x, projectionMatrix);
                    matrixNeedsUpdate = false;
                }
                visitor.mat4(projectionMatrixName, projectionMatrix, false);
                base.setUniforms(visitor);
            }
        };
        return self;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createPerspective;
});
