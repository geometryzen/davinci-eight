define(["require", "exports", 'davinci-eight/cameras/view', 'davinci-eight/math/Matrix4', 'davinci-eight/core/Symbolic', '../checks/isUndefined', '../checks/expectArg'], function (require, exports, view, Matrix4, Symbolic, isUndefined, expectArg) {
    //let UNIFORM_PROJECTION_MATRIX_NAME = 'uProjectionMatrix';
    /**
     * @class perspective
     * @constructor
     * @param fov {number}
     * @param aspect {number}
     * @param near {number}
     * @param far {number}
     * @return {Perspective}
     */
    var perspective = function (options) {
        options = options || {};
        var fov = isUndefined(options.fov) ? 75 * Math.PI / 180 : options.fov;
        var aspect = isUndefined(options.aspect) ? 1 : options.aspect;
        var near = isUndefined(options.near) ? 0.1 : options.near;
        var far = expectArg('options.far', isUndefined(options.far) ? 2000 : options.far).toBeNumber().value;
        var projectionMatrixName = isUndefined(options.projectionMatrixName) ? Symbolic.UNIFORM_PROJECTION_MATRIX : options.projectionMatrixName;
        var base = view(options);
        var projectionMatrix = Matrix4.identity();
        var matrixNeedsUpdate = true;
        var self = {
            // Delegate to the base camera.
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
                return fov;
            },
            set fov(value) {
                self.setFov(value);
            },
            setFov: function (value) {
                expectArg('fov', value).toBeNumber();
                matrixNeedsUpdate = matrixNeedsUpdate || fov !== value;
                fov = value;
                return self;
            },
            get aspect() {
                return aspect;
            },
            set aspect(value) {
                self.setAspect(value);
            },
            setAspect: function (value) {
                expectArg('aspect', value).toBeNumber();
                matrixNeedsUpdate = matrixNeedsUpdate || aspect !== value;
                aspect = value;
                return self;
            },
            get near() {
                return near;
            },
            set near(value) {
                self.setNear(value);
            },
            setNear: function (value) {
                expectArg('near', value).toBeNumber();
                matrixNeedsUpdate = matrixNeedsUpdate || near !== value;
                near = value;
                return self;
            },
            get far() {
                return far;
            },
            set far(value) {
                self.setFar(value);
            },
            setFar: function (value) {
                expectArg('far', value).toBeNumber();
                matrixNeedsUpdate = matrixNeedsUpdate || far !== value;
                far = value;
                return self;
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
                expectArg('name', name).toBeString();
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
            getUniformMeta: function () {
                var uniforms = base.getUniformMeta();
                uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX] = { name: projectionMatrixName, glslType: 'mat4' };
                return uniforms;
            }
        };
        return self;
    };
    return perspective;
});
