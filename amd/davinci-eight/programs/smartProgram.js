define(["require", "exports", '../scene/MonitorList', '../programs/fragmentShader', '../utils/mergeStringMapList', '../checks/mustBeDefined', './createGraphicsProgram', '../programs/vColorRequired', '../programs/vertexShader', '../programs/vLightRequired'], function (require, exports, MonitorList_1, fragmentShader_1, mergeStringMapList_1, mustBeDefined_1, createGraphicsProgram_1, vColorRequired_1, vertexShader_1, vLightRequired_1) {
    function smartProgram(monitors, attributes, uniformsList, bindings) {
        MonitorList_1.default.verify('monitors', monitors, function () { return "smartProgram"; });
        mustBeDefined_1.default('attributes', attributes);
        mustBeDefined_1.default('uniformsList', uniformsList);
        var uniforms = mergeStringMapList_1.default(uniformsList);
        var vColor = vColorRequired_1.default(attributes, uniforms);
        var vLight = vLightRequired_1.default(attributes, uniforms);
        var innerProgram = createGraphicsProgram_1.default(monitors, vertexShader_1.default(attributes, uniforms, vColor, vLight), fragmentShader_1.default(attributes, uniforms, vColor, vLight), bindings);
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
            contextFree: function (manager) {
                return innerProgram.contextFree(manager);
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
            vec2: function (name, vector, canvasId) {
                return innerProgram.vec2(name, vector, canvasId);
            },
            vec3: function (name, vector, canvasId) {
                return innerProgram.vec3(name, vector, canvasId);
            },
            vec4: function (name, vector, canvasId) {
                return innerProgram.vec4(name, vector, canvasId);
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
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = smartProgram;
});
