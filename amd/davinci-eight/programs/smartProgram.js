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
            attributes: function () {
                return innerProgram.attributes();
            },
            uniforms: function () {
                return innerProgram.uniforms();
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
            contextLost: function () {
                return innerProgram.contextLost();
            },
            use: function () {
                return innerProgram.use();
            },
            enableAttrib: function (name) {
                return innerProgram.enableAttrib(name);
            },
            disableAttrib: function (name) {
                return innerProgram.disableAttrib(name);
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
            mat2: function (name, matrix, transpose) {
                return innerProgram.mat2(name, matrix, transpose);
            },
            mat3: function (name, matrix, transpose) {
                return innerProgram.mat3(name, matrix, transpose);
            },
            mat4: function (name, matrix, transpose) {
                return innerProgram.mat4(name, matrix, transpose);
            },
            vec2: function (name, vector) {
                return innerProgram.vec2(name, vector);
            },
            vec3: function (name, vector) {
                return innerProgram.vec3(name, vector);
            },
            vec4: function (name, vector) {
                return innerProgram.vec4(name, vector);
            },
            vector2: function (name, data) {
                return innerProgram.vector2(name, data);
            },
            vector3: function (name, data) {
                return innerProgram.vector3(name, data);
            },
            vector4: function (name, data) {
                return innerProgram.vector4(name, data);
            }
        };
        return self;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = smartProgram;
});
