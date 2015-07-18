define(["require", "exports", '../math/Vector3', '../math/Matrix4', '../core/Symbolic'], function (require, exports, Vector3, Matrix4, Symbolic) {
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
        updateViewMatrix();
        var publicAPI = {
            get eye() {
                return eye;
            },
            set eye(value) {
                eye = new Vector3(value);
                updateViewMatrix();
            },
            get look() {
                return look;
            },
            set look(value) {
                look = new Vector3(value);
                updateViewMatrix();
            },
            get up() {
                return up;
            },
            set up(value) {
                up = new Vector3(value).normalize();
                updateViewMatrix();
            },
            getUniformMatrix3: function (name) {
                return null;
            },
            getUniformMatrix4: function (name) {
                switch (name) {
                    case UNIFORM_VIEW_MATRIX_NAME: {
                        //console.log("viewMatrix: " + viewMatrix.toFixed(0));
                        return { transpose: false, matrix4: viewMatrix.elements };
                    }
                    default: {
                        return null; //base.getUniformMatrix4(name);
                    }
                }
            },
            getUniformVector3: function (name) {
                return null;
            },
            getUniformMetaInfos: function () {
                var uniforms = {}; //base.getUniformMetaInfos();
                uniforms[Symbolic.UNIFORM_VIEW_MATRIX] = { name: UNIFORM_VIEW_MATRIX_NAME, type: UNIFORM_VIEW_MATRIX_TYPE };
                return uniforms;
            }
        };
        return publicAPI;
    };
    return view;
});
