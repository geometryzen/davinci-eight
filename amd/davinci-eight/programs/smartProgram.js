define(["require", "exports", '../programs/fragmentShader', '../utils/mergeStringMapList', '../checks/mustBeDefined', '../core/ShareableWebGLProgram', '../programs/vColorRequired', '../programs/vertexShader', '../programs/vLightRequired'], function (require, exports, fragmentShader_1, mergeStringMapList_1, mustBeDefined_1, ShareableWebGLProgram_1, vColorRequired_1, vertexShader_1, vLightRequired_1) {
    function smartProgram(attributes, uniformsList, bindings) {
        mustBeDefined_1.default('attributes', attributes);
        mustBeDefined_1.default('uniformsList', uniformsList);
        var uniforms = mergeStringMapList_1.default(uniformsList);
        var vColor = vColorRequired_1.default(attributes, uniforms);
        var vLight = vLightRequired_1.default(attributes, uniforms);
        return new ShareableWebGLProgram_1.default(vertexShader_1.default(attributes, uniforms, vColor, vLight), fragmentShader_1.default(attributes, uniforms, vColor, vLight), bindings);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = smartProgram;
});
