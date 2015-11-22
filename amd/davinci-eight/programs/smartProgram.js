define(["require", "exports", '../scene/MonitorList', '../programs/fragmentShader', '../utils/mergeStringMapList', '../checks/mustBeDefined', './createGraphicsProgram', '../programs/vColorRequired', '../programs/vertexShader', '../programs/vLightRequired'], function (require, exports, MonitorList, fragmentShader, mergeStringMapList, mustBeDefined, createGraphicsProgram, vColorRequired, vertexShader, vLightRequired) {
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
        var innerProgram = createGraphicsProgram(monitors, vertexShader(attributes, uniforms, vColor, vLight), fragmentShader(attributes, uniforms, vColor, vLight), bindings);
        var self = {
            get uuid() {
                return innerProgram.uuid;
            },
            attributes: function (canvasId) {
                return innerProgram.attributes(canvasId);
            },
            uniforms: function (canvasId) {
                return innerProgram.uniforms(canvasId);
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
            contextLost: function (canvasId) {
                return innerProgram.contextLost(canvasId);
            },
            use: function (canvasId) {
                return innerProgram.use(canvasId);
            },
            enableAttrib: function (name, canvasId) {
                return innerProgram.enableAttrib(name, canvasId);
            },
            disableAttrib: function (name, canvasId) {
                return innerProgram.disableAttrib(name, canvasId);
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
            mat2: function (name, matrix, transpose, canvasId) {
                return innerProgram.mat2(name, matrix, transpose, canvasId);
            },
            mat3: function (name, matrix, transpose, canvasId) {
                return innerProgram.mat3(name, matrix, transpose, canvasId);
            },
            mat4: function (name, matrix, transpose, canvasId) {
                return innerProgram.mat4(name, matrix, transpose, canvasId);
            },
            uniformVectorE2: function (name, vector, canvasId) {
                return innerProgram.uniformVectorE2(name, vector, canvasId);
            },
            uniformVectorE3: function (name, vector, canvasId) {
                return innerProgram.uniformVectorE3(name, vector, canvasId);
            },
            uniformVectorE4: function (name, vector, canvasId) {
                return innerProgram.uniformVectorE4(name, vector, canvasId);
            },
            vector2: function (name, data, canvasId) {
                return innerProgram.vector2(name, data, canvasId);
            },
            vector3: function (name, data, canvasId) {
                return innerProgram.vector3(name, data, canvasId);
            },
            vector4: function (name, data, canvasId) {
                return innerProgram.vector4(name, data, canvasId);
            }
        };
        return self;
    };
    return smartProgram;
});
