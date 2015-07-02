define(["require", "exports", './rawShaderMaterial'], function (require, exports, material) {
    /**
     *
     */
    var vertexShader = [
        "attribute vec3 aVertexPosition;",
        "attribute vec3 aVertexColor;",
        "",
        "uniform mat4 uMVMatrix;",
        "uniform mat4 uPMatrix;",
        "",
        "varying highp vec4 vColor;",
        "void main(void)",
        "{",
        "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
        "vColor = vec4(aVertexColor, 1.0);",
        "gl_PointSize = 6.0;",
        "}"
    ].join("\n");
    /**
     *
     */
    var fragmentShader = [
        "varying highp vec4 vColor;",
        "void main(void)",
        "{",
        "gl_FragColor = vColor;",
        "}"
    ].join("\n");
    /**
     *
     */
    var pointsMaterial = function () {
        // The inner object compiles the shaders and introspects them.
        var inner = material(vertexShader, fragmentShader);
        var publicAPI = {
            get attributes() {
                return inner.attributes;
            },
            get uniforms() {
                return inner.uniforms;
            },
            get varyings() {
                return inner.varyings;
            },
            get program() {
                return inner.program;
            },
            get programId() {
                return inner.programId;
            },
            contextFree: function (context) {
                return inner.contextFree(context);
            },
            contextGain: function (context, contextGainId) {
                return inner.contextGain(context, contextGainId);
            },
            contextLoss: function () {
                return inner.contextLoss();
            },
            hasContext: function () {
                return inner.hasContext();
            }
        };
        return publicAPI;
    };
    return pointsMaterial;
});
