var fragmentShader = require('../programs/fragmentShader');
var isDefined = require('../checks/isDefined');
var shaderProgram = require('./shaderProgram');
var Symbolic = require('../core/Symbolic');
var vertexShader = require('../programs/vertexShader');
function vLightRequired(uniforms) {
    return !!uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
}
function vColorRequired(attributes, uniforms) {
    return !!attributes[Symbolic.ATTRIBUTE_COLOR] || !!uniforms[Symbolic.UNIFORM_COLOR];
}
/**
 *
 */
var smartProgram = function (attributes, uniformsList) {
    if (!isDefined(attributes)) {
        throw new Error("The attributes parameter is required for smartProgram.");
    }
    if (uniformsList) {
    }
    else {
        throw new Error("The uniformsList parameter is required for smartProgram.");
    }
    var uniforms = {};
    uniformsList.forEach(function (uniformsElement) {
        for (var name in uniformsElement) {
            uniforms[name] = uniformsElement[name];
        }
    });
    var vColor = vColorRequired(attributes, uniforms);
    var vLight = vLightRequired(uniforms);
    var innerProgram = shaderProgram(vertexShader(attributes, uniforms, vColor, vLight), fragmentShader(attributes, uniforms, vColor, vLight));
    var self = {
        get program() {
            return innerProgram.program;
        },
        get programId() {
            return innerProgram.programId;
        },
        get attributeLocations() {
            return innerProgram.attributeLocations;
        },
        get uniforms() {
            return innerProgram.uniforms;
        },
        get vertexShader() {
            return innerProgram.vertexShader;
        },
        get fragmentShader() {
            return innerProgram.fragmentShader;
        },
        addRef: function () {
            return innerProgram.addRef();
        },
        release: function () {
            return innerProgram.release();
        },
        contextFree: function () {
            return innerProgram.contextFree();
        },
        contextGain: function (context) {
            return innerProgram.contextGain(context);
        },
        contextLoss: function () {
            return innerProgram.contextLoss();
        },
        hasContext: function () {
            return innerProgram.hasContext();
        },
        use: function () {
            return innerProgram.use();
        },
        enableAttrib: function (name) {
            return innerProgram.enableAttrib(name);
        },
        setAttributes: function (values) {
            return innerProgram.setAttributes(values);
        },
        uniform1f: function (name, x) {
            return innerProgram.uniform1f(name, x);
        },
        uniform2f: function (name, x, y) {
            return innerProgram.uniform2f(name, x, y);
        },
        uniform3f: function (name, x, y, z) {
            return innerProgram.uniform3f(name, x, y, z);
        },
        uniform4f: function (name, x, y, z, w) {
            return innerProgram.uniform4f(name, x, y, z, w);
        },
        uniformMatrix1: function (name, transpose, matrix) {
            return innerProgram.uniformMatrix1(name, transpose, matrix);
        },
        uniformMatrix2: function (name, transpose, matrix) {
            return innerProgram.uniformMatrix2(name, transpose, matrix);
        },
        uniformMatrix3: function (name, transpose, matrix) {
            return innerProgram.uniformMatrix3(name, transpose, matrix);
        },
        uniformMatrix4: function (name, transpose, matrix) {
            return innerProgram.uniformMatrix4(name, transpose, matrix);
        },
        uniformVector1: function (name, vector) {
            return innerProgram.uniformVector1(name, vector);
        },
        uniformVector2: function (name, vector) {
            return innerProgram.uniformVector2(name, vector);
        },
        uniformVector3: function (name, vector) {
            return innerProgram.uniformVector3(name, vector);
        },
        uniformVector4: function (name, vector) {
            return innerProgram.uniformVector4(name, vector);
        }
    };
    return self;
};
module.exports = smartProgram;
