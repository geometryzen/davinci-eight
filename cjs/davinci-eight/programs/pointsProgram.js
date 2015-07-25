var shaderProgram = require('../programs/shaderProgram');
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
var pointsProgram = function () {
    var innerProgram = shaderProgram(vertexShader, fragmentShader);
    var publicAPI = {
        get attributes() {
            return innerProgram.attributes;
        },
        get constants() {
            return innerProgram.constants;
        },
        get uniforms() {
            return innerProgram.uniforms;
        },
        get varyings() {
            return innerProgram.varyings;
        },
        get program() {
            return innerProgram.program;
        },
        get programId() {
            return innerProgram.programId;
        },
        contextFree: function () {
            return innerProgram.contextFree();
        },
        contextGain: function (context, contextGainId) {
            return innerProgram.contextGain(context, contextGainId);
        },
        contextLoss: function () {
            return innerProgram.contextLoss();
        },
        hasContext: function () {
            return innerProgram.hasContext();
        },
        get vertexShader() {
            return innerProgram.vertexShader;
        },
        get fragmentShader() {
            return innerProgram.fragmentShader;
        },
        use: function () {
            return innerProgram.use();
        },
        attributeLocation: function (name) {
            return innerProgram.attributeLocation(name);
        },
        uniformLocation: function (name) {
            return innerProgram.uniformLocation(name);
        }
    };
    return publicAPI;
};
module.exports = pointsProgram;
