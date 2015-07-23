var Vector3 = require('../math/Vector3');
var Matrix4 = require('../math/Matrix4');
var Symbolic = require('../core/Symbolic');
var DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
var UNIFORM_VIEW_MATRIX_NAME = 'uViewMatrix';
var UNIFORM_VIEW_MATRIX_TYPE = 'mat4';
var UNIFORM_AMBIENT_LIGHT_NAME = 'uAmbientLight';
var UNIFORM_AMBIENT_LIGHT_TYPE = 'vec3';
/**
 * @class view
 * @constructor
 */
var view = function () {
    var eye = new Vector3();
    var look = new Vector3();
    var up = Vector3.e2;
    var viewMatrix = new Matrix4();
    var base = new DefaultUniformProvider();
    function updateViewMatrix() {
        var n = new Vector3().subVectors(eye, look);
        if (n.x === 0 && n.y === 0 && n.z === 0) {
            // View direction is ambiguous.
            n.z = 1;
        }
        else {
            n.normalize();
        }
        var u = new Vector3().crossVectors(up, n);
        var v = new Vector3().crossVectors(n, u);
        var d = new Vector3({ x: eye.dot(u), y: eye.dot(v), z: eye.dot(n) }).multiplyScalar(-1);
        var m = viewMatrix.elements;
        m[0] = u.x;
        m[4] = u.y;
        m[8] = u.z;
        m[12] = d.x;
        m[1] = v.x;
        m[5] = v.y;
        m[9] = v.z;
        m[13] = d.y;
        m[2] = n.x;
        m[6] = n.y;
        m[10] = n.z;
        m[14] = d.z;
        m[3] = 0;
        m[7] = 0;
        m[11] = 0;
        m[15] = 1;
    }
    // Force an update of the view matrix.
    eye.modified = true;
    look.modified = true;
    up.modified = true;
    var publicAPI = {
        get eye() {
            return eye;
        },
        set eye(value) {
            eye.x = value.x;
            eye.y = value.y;
            eye.z = value.z;
        },
        get look() {
            return look;
        },
        set look(value) {
            look.x = value.x;
            look.y = value.y;
            look.z = value.z;
        },
        get up() {
            return up;
        },
        set up(value) {
            up.x = value.x;
            up.y = value.y;
            up.z = value.z;
            up.normalize();
        },
        getUniformMatrix3: function (name) {
            return base.getUniformMatrix3(name);
        },
        getUniformMatrix4: function (name) {
            switch (name) {
                case UNIFORM_VIEW_MATRIX_NAME: {
                    if (eye.modified || look.modified || up.modified) {
                        updateViewMatrix();
                        eye.modified = false;
                        look.modified = false;
                        up.modified = false;
                    }
                    return { transpose: false, matrix4: viewMatrix.elements };
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
            if (typeof uniforms === 'object') {
                uniforms[Symbolic.UNIFORM_VIEW_MATRIX] = { name: UNIFORM_VIEW_MATRIX_NAME, type: UNIFORM_VIEW_MATRIX_TYPE };
                return uniforms;
            }
            else {
                throw new Error("Unexpected typeof uniforms => " + typeof uniforms);
            }
        }
    };
    return publicAPI;
};
module.exports = view;
