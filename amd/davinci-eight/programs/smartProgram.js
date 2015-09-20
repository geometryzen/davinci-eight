define(["require", "exports", '../scene/MonitorList', '../programs/fragmentShader', '../utils/mergeStringMapList', '../checks/mustBeDefined', './shaderProgram', '../programs/vColorRequired', '../programs/vertexShader', '../programs/vLightRequired'], function (require, exports, MonitorList, fragmentShader, mergeStringMapList, mustBeDefined, shaderProgram, vColorRequired, vertexShader, vLightRequired) {
    /**
     *
     */
    var smartProgram = function (monitors, attributes, uniformsList, bindings) {
        MonitorList.verify('monitors', monitors, function () { return "smartProgram"; });
        mustBeDefined('attributes', attributes);
        mustBeDefined('uniformsList', uniformsList);
        var uniforms = mergeStringMapList(uniformsList);
        var vColor = vColorRequired(attributes, uniforms);
        var vLight = vLightRequired(attributes, uniforms);
        var innerProgram = shaderProgram(monitors, vertexShader(attributes, uniforms, vColor, vLight), fragmentShader(attributes, uniforms, vColor, vLight), bindings);
        var self = {
            get programId() {
                return innerProgram.programId;
            },
            get attributes() {
                return innerProgram.attributes;
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
            contextFree: function (canvasId) {
                return innerProgram.contextFree(canvasId);
            },
            contextGain: function (manager) {
                return innerProgram.contextGain(manager);
            },
            contextLoss: function (canvasId) {
                return innerProgram.contextLoss(canvasId);
            },
            use: function (canvasId) {
                return innerProgram.use(canvasId);
            },
            enableAttrib: function (name) {
                return innerProgram.enableAttrib(name);
            },
            disableAttrib: function (name) {
                return innerProgram.disableAttrib(name);
            },
            uniform1f: function (name, x, canvasId) {
                return innerProgram.uniform1f(name, x, canvasId);
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
    return smartProgram;
});
