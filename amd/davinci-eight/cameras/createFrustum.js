define(["require", "exports", 'davinci-eight/cameras/createView', 'davinci-eight/math/Mat4R', '../math/R1'], function (require, exports, createView_1, Mat4R_1, R1_1) {
    function createFrustum(viewMatrixName, projectionMatrixName) {
        var refCount = 1;
        var base = createView_1.default(viewMatrixName);
        var left = new R1_1.default();
        var right = new R1_1.default();
        var bottom = new R1_1.default();
        var top = new R1_1.default();
        var near = new R1_1.default();
        var far = new R1_1.default();
        var projectionMatrix = Mat4R_1.default.one();
        function updateProjectionMatrix() {
            projectionMatrix.frustum(left.x, right.x, bottom.x, top.x, near.x, far.x);
        }
        updateProjectionMatrix();
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
                return base.eye;
            },
            set eye(value) {
                base.eye = value;
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
            set up(up) {
                base.setUp(up);
            },
            setUp: function (up) {
                base.setUp(up);
                return self;
            },
            get left() {
                return left.x;
            },
            set left(value) {
                left.x = value;
                updateProjectionMatrix();
            },
            get right() {
                return right.x;
            },
            set right(value) {
                right.x = value;
                updateProjectionMatrix();
            },
            get bottom() {
                return bottom.x;
            },
            set bottom(value) {
                bottom.x = value;
                updateProjectionMatrix();
            },
            get top() {
                return top.x;
            },
            set top(value) {
                top.x = value;
                updateProjectionMatrix();
            },
            get near() {
                return near.x;
            },
            set near(value) {
                near.x = value;
                updateProjectionMatrix();
            },
            get far() {
                return far.x;
            },
            set far(value) {
                far.x = value;
                updateProjectionMatrix();
            },
            setUniforms: function (visitor, canvasId) {
                visitor.mat4(projectionMatrixName, projectionMatrix, false, canvasId);
                base.setUniforms(visitor, canvasId);
            }
        };
        return self;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createFrustum;
});
