import geometryConstructor = require('eight/core/geometry');
import meshBasicMaterial = require('eight/materials/meshBasicMaterial');
import object3D = require('eight/core/object3D');
import vs_source = require('eight/shaders/shader-vs');
import fs_source = require('eight/shaders/shader-fs');
import glMatrix = require('gl-matrix');
import Euclidean3 = require('eight/math/e3ga/Euclidean3');

var mesh = function(geometry?, material?) {
    var gl: WebGLRenderingContext = null;
    var _vs: WebGLShader = null;
    var _fs: WebGLShader = null;
    var _program: WebGLProgram = null;
    var _vbo: WebGLBuffer = null;
    var _vbn: WebGLBuffer = null;
    var _vbc: WebGLBuffer = null;
    var _mvMatrixUniform: WebGLUniformLocation = null;
    var _normalMatrixUniform: WebGLUniformLocation = null;
    var _pMatrixUniform: WebGLUniformLocation = null;
    var _mvMatrix = glMatrix.mat4.create();
    var _normalMatrix = glMatrix.mat3.create();
    geometry = geometry || geometryConstructor();
    material = material || meshBasicMaterial({ 'color': Math.random() * 0xffffff });

    var base = object3D();

    var that = {
        get position(): Euclidean3 {return base.position },
        set position(position) { base.position = position },
        get attitude(): Euclidean3 {return base.attitude },
        set attitude(attitude) { base.attitude = attitude },
        projectionMatrix: glMatrix.mat4.create(),
        onContextGain: function(context) {
            gl = context;

            _vs = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(_vs, vs_source);
            gl.compileShader(_vs);
            if (!gl.getShaderParameter(_vs, gl.COMPILE_STATUS) && !gl.isContextLost()) {
                var infoLog = gl.getShaderInfoLog(_vs);
                alert("Error compiling vertex shader:\n" + infoLog);
            }

            _fs = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(_fs, fs_source);
            gl.compileShader(_fs);
            if (!gl.getShaderParameter(_fs, gl.COMPILE_STATUS) && !gl.isContextLost()) {
                var infoLog = gl.getShaderInfoLog(_fs);
                alert("Error compiling fragment shader:\n" + infoLog);
            }

            _program = gl.createProgram();

            gl.attachShader(_program, _vs);
            gl.attachShader(_program, _fs);
            gl.linkProgram(_program);

            if (!gl.getProgramParameter(_program, gl.LINK_STATUS) && !gl.isContextLost()) {
                var infoLog = gl.getProgramInfoLog(_program);
                alert("Error linking program:\n" + infoLog);
            }

            _vbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, _vbo);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.vertices), gl.STATIC_DRAW);

            _vbn = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, _vbn);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.normals), gl.STATIC_DRAW);

            _vbc = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, _vbc);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.colors), gl.STATIC_DRAW);

            _mvMatrixUniform = gl.getUniformLocation(_program, "uMVMatrix");
            _normalMatrixUniform = gl.getUniformLocation(_program, "uNormalMatrix");
            _pMatrixUniform = gl.getUniformLocation(_program, "uPMatrix");
        },
        onContextLoss: function() {
            _vs = null;
            _fs = null;
            _program = null;
            _vbc = null;
            _vbo = null;
            _vbn = null;
            _mvMatrixUniform = null;
            _pMatrixUniform = null;
        },
        tearDown: function() {
            gl.deleteShader(_vs);
            gl.deleteShader(_fs);
            gl.deleteProgram(_program);
        },
        updateMatrix: function() {
            // The following performs the rotation first followed by the translation.
            var v = glMatrix.vec3.fromValues(that.position.x, that.position.y, that.position.z);
            var q = glMatrix.quat.fromValues(-that.attitude.yz, -that.attitude.zx, -that.attitude.xy, that.attitude.w);
            /*
                  mat4.identity(mvMatrix);
                  mat4.translate(mvMatrix, mvMatrix, v);
                  var quatMat = mat4.create();
                  mat4.fromQuat(quatMat, q);
                  mat4.multiply(mvMatrix, mvMatrix, quatMat);
            */
            glMatrix.mat4.fromRotationTranslation(_mvMatrix, q, v);

            // TODO: Should we be computing this inside the shader?
            glMatrix.mat3.normalFromMat4(_normalMatrix, _mvMatrix);
        },
        draw: function(projectionMatrix) {
            if (gl) {
                gl.useProgram(_program);

                that.updateMatrix();

                gl.uniformMatrix4fv(_mvMatrixUniform, false, _mvMatrix);
                gl.uniformMatrix3fv(_normalMatrixUniform, false, _normalMatrix);
                gl.uniformMatrix4fv(_pMatrixUniform, false, projectionMatrix);

                var vertexPositionAttribute = gl.getAttribLocation(_program, "aVertexPosition");
                gl.enableVertexAttribArray(vertexPositionAttribute);

                gl.bindBuffer(gl.ARRAY_BUFFER, _vbo);
                gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

                var vertexNormalAttribute = gl.getAttribLocation(_program, "aVertexNormal");
                gl.enableVertexAttribArray(vertexNormalAttribute);
                gl.bindBuffer(gl.ARRAY_BUFFER, _vbn);
                gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

                var vertexColorAttribute = gl.getAttribLocation(_program, "aVertexColor");
                gl.enableVertexAttribArray(vertexColorAttribute);
                gl.bindBuffer(gl.ARRAY_BUFFER, _vbc);
                gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

                gl.drawArrays(gl.TRIANGLES, 0, geometry.triangles.length * 3);
            }
        }
    };

    return that;
};

export = mesh;
