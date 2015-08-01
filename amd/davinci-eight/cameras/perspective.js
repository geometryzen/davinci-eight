define(["require", "exports", 'davinci-eight/cameras/view', 'davinci-eight/math/Matrix4', 'davinci-eight/core/Symbolic', '../checks/isUndefined', '../checks/expectArg'], function (require, exports, view, Matrix4, Symbolic, isUndefined, expectArg) {
    //let UNIFORM_PROJECTION_MATRIX_NAME = 'uProjectionMatrix';
    /**
     * @class perspective
     * @constructor
     * @param fov {number}
     * @param aspect {number}
     * @param near {number}
     * @param far {number}
     * @return {LinearPerspectiveCamera}
     */
    var perspective = function (options) {
        options = options || {};
        var fov = isUndefined(options.fov) ? 75 * Math.PI / 180 : options.fov;
        var aspect = isUndefined(options.aspect) ? 1 : options.aspect;
        var near = isUndefined(options.near) ? 0.1 : options.near;
        var far = expectArg('options.far', isUndefined(options.far) ? 2000 : options.far).toBeNumber().value;
        var projectionMatrixName = isUndefined(options.projectionMatrixName) ? Symbolic.UNIFORM_PROJECTION_MATRIX : options.projectionMatrixName;
        var base = view(options);
        var projectionMatrix = Matrix4.create();
        var matrixNeedsUpdate = true;
        var self = {
            // Delegate to the base camera.
            get eye() {
                return base.eye;
            },
            set eye(value) {
                base.eye = value;
            },
            setEye: function (eye) {
                self.eye = eye;
                return self;
            },
            get look() {
                return base.look;
            },
            set look(value) {
                base.look = value;
            },
            get up() {
                return base.up;
            },
            set up(value) {
                base.up = value;
            },
            get fov() {
                return fov;
            },
            set fov(value) {
                fov = value;
                matrixNeedsUpdate = matrixNeedsUpdate || fov !== value;
            },
            get aspect() {
                return aspect;
            },
            set aspect(value) {
                aspect = value;
                matrixNeedsUpdate = matrixNeedsUpdate || aspect !== value;
            },
            setAspect: function (aspect) {
                self.aspect = aspect;
                return self;
            },
            get near() {
                return near;
            },
            set near(value) {
                near = value;
                matrixNeedsUpdate = matrixNeedsUpdate || near !== value;
            },
            get far() {
                return far;
            },
            set far(value) {
                far = value;
                matrixNeedsUpdate = matrixNeedsUpdate || far !== value;
            },
            getUniformFloat: function (name) {
                return base.getUniformFloat(name);
            },
            getUniformMatrix2: function (name) {
                return base.getUniformMatrix2(name);
            },
            getUniformMatrix3: function (name) {
                return base.getUniformMatrix3(name);
            },
            getUniformMatrix4: function (name) {
                switch (name) {
                    case projectionMatrixName: {
                        if (matrixNeedsUpdate) {
                            projectionMatrix.perspective(fov, aspect, near, far);
                            matrixNeedsUpdate = false;
                        }
                        return { transpose: false, matrix4: projectionMatrix.elements };
                    }
                    default: {
                        return base.getUniformMatrix4(name);
                    }
                }
            },
            getUniformVector2: function (name) {
                return base.getUniformVector2(name);
            },
            getUniformVector3: function (name) {
                return base.getUniformVector3(name);
            },
            getUniformVector4: function (name) {
                return base.getUniformVector4(name);
            },
            getUniformMetaInfos: function () {
                var uniforms = base.getUniformMetaInfos();
                uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX] = { name: projectionMatrixName, glslType: 'mat4' };
                return uniforms;
            }
        };
        return self;
    };
    return perspective;
});
