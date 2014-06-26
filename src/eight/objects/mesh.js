define(["require", "exports", 'eight/core/geometry', 'eight/materials/meshBasicMaterial', 'eight/core/object3D', 'eight/shaders/shader-vs', 'eight/shaders/shader-fs'], function(require, exports, geometryConstructor, meshBasicMaterial, object3D, vs_source, fs_source) {
    var mesh = function (geometry, material) {
        var gl = null;
        var vs = null;
        var fs = null;
        var program = null;
        var vbo = null;
        var vbn = null;
        var vbc = null;
        var mvMatrixUniform = null;
        var normalMatrixUniform = null;
        var pMatrixUniform = null;
        var mvMatrix = mat4.create();
        var normalMatrix = mat3.create();
        geometry = geometry || geometryConstructor();
        material = material || meshBasicMaterial({ 'color': Math.random() * 0xffffff });

        var base = object3D();

        var that = {
            get position() {
                return base.position;
            },
            set position(position) {
                base.position = position;
            },
            get attitude() {
                return base.attitude;
            },
            set attitude(attitude) {
                base.attitude = attitude;
            },
            projectionMatrix: mat4.create(),
            onContextGain: function (context) {
                gl = context;

                vs = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vs, vs_source);
                gl.compileShader(vs);
                if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS) && !gl.isContextLost()) {
                    var infoLog = gl.getShaderInfoLog(vs);
                    alert("Error compiling vertex shader:\n" + infoLog);
                }

                fs = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fs, fs_source);
                gl.compileShader(fs);
                if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS) && !gl.isContextLost()) {
                    var infoLog = gl.getShaderInfoLog(fs);
                    alert("Error compiling fragment shader:\n" + infoLog);
                }

                program = gl.createProgram();

                gl.attachShader(program, vs);
                gl.attachShader(program, fs);
                gl.linkProgram(program);

                if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
                    var infoLog = gl.getProgramInfoLog(program);
                    alert("Error linking program:\n" + infoLog);
                }

                vbo = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.vertices), gl.STATIC_DRAW);

                vbn = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vbn);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.normals), gl.STATIC_DRAW);

                vbc = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vbc);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.colors), gl.STATIC_DRAW);

                mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
                normalMatrixUniform = gl.getUniformLocation(program, "uNormalMatrix");
                pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
            },
            onContextLoss: function () {
                vs = null;
                fs = null;
                program = null;
                vbc = null;
                vbo = null;
                vbn = null;
                mvMatrixUniform = null;
                pMatrixUniform = null;
            },
            tearDown: function () {
                gl.deleteShader(vs);
                gl.deleteShader(fs);
                gl.deleteProgram(program);
            },
            updateMatrix: function () {
                var v = vec3.fromValues(that.position.x, that.position.y, that.position.z);
                var q = quat.fromValues(-that.attitude.yz, -that.attitude.zx, -that.attitude.xy, that.attitude.w);

                mat4.fromRotationTranslation(mvMatrix, q, v);

                mat3.normalFromMat4(normalMatrix, mvMatrix);
            },
            draw: function (projectionMatrix) {
                if (gl) {
                    gl.useProgram(program);

                    that.updateMatrix();

                    gl.uniformMatrix4fv(mvMatrixUniform, false, mvMatrix);
                    gl.uniformMatrix3fv(normalMatrixUniform, false, normalMatrix);
                    gl.uniformMatrix4fv(pMatrixUniform, false, projectionMatrix);

                    var vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
                    gl.enableVertexAttribArray(vertexPositionAttribute);

                    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

                    var vertexNormalAttribute = gl.getAttribLocation(program, "aVertexNormal");
                    gl.enableVertexAttribArray(vertexNormalAttribute);
                    gl.bindBuffer(gl.ARRAY_BUFFER, vbn);
                    gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

                    var vertexColorAttribute = gl.getAttribLocation(program, "aVertexColor");
                    gl.enableVertexAttribArray(vertexColorAttribute);
                    gl.bindBuffer(gl.ARRAY_BUFFER, vbc);
                    gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

                    gl.drawArrays(gl.TRIANGLES, 0, geometry.triangles.length * 3);
                }
            }
        };

        return that;
    };

    
    return mesh;
});
