define(["require", "exports", '../scene/MonitorList', '../programs/fragmentShader', '../utils/mergeStringMapList', '../checks/mustBeDefined', './createMaterial', '../programs/vColorRequired', '../programs/vertexShader', '../programs/vLightRequired'], function (require, exports, MonitorList, fragmentShader, mergeStringMapList, mustBeDefined, createMaterial, vColorRequired, vertexShader, vLightRequired) {
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
        var innerProgram = createMaterial(monitors, vertexShader(attributes, uniforms, vColor, vLight), fragmentShader(attributes, uniforms, vColor, vLight), bindings);
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
            uniform2f: function (name, x, y, canvasId) {
                return innerProgram.uniform2f(name, x, y, canvasId);
            },
            uniform3f: function (name, x, y, z, canvasId) {
                return innerProgram.uniform3f(name, x, y, z, canvasId);
            },
            uniform4f: function (name, x, y, z, w, canvasId) {
                return innerProgram.uniform4f(name, x, y, z, w, canvasId);
            },
            uniformMatrix1: function (name, transpose, matrix, canvasId) {
                return innerProgram.uniformMatrix1(name, transpose, matrix, canvasId);
            },
            uniformMatrix2: function (name, transpose, matrix, canvasId) {
                return innerProgram.uniformMatrix2(name, transpose, matrix, canvasId);
            },
            uniformMatrix3: function (name, transpose, matrix, canvasId) {
                return innerProgram.uniformMatrix3(name, transpose, matrix, canvasId);
            },
            uniformMatrix4: function (name, transpose, matrix, canvasId) {
                return innerProgram.uniformMatrix4(name, transpose, matrix, canvasId);
            },
            uniformVector1: function (name, vector, canvasId) {
                return innerProgram.uniformVector1(name, vector, canvasId);
            },
            uniformVector2: function (name, vector, canvasId) {
                return innerProgram.uniformVector2(name, vector, canvasId);
            },
            uniformVector3: function (name, vector, canvasId) {
                return innerProgram.uniformVector3(name, vector, canvasId);
            },
            uniformVector4: function (name, vector, canvasId) {
                return innerProgram.uniformVector4(name, vector, canvasId);
            }
        };
        return self;
    };
    return smartProgram;
});
