define(["require", "exports", '../core/getAttribVarName', '../programs/glslAttribType', '../checks/mustBeInteger', '../checks/mustBeString', '../materials/SmartGraphicsProgram', '../programs/vColorRequired', '../programs/vLightRequired', '../programs/fragmentShader', '../programs/vertexShader'], function (require, exports, getAttribVarName_1, glslAttribType_1, mustBeInteger_1, mustBeString_1, SmartGraphicsProgram_1, vColorRequired_1, vLightRequired_1, fragmentShader_1, vertexShader_1) {
    function computeAttribParams(values) {
        var result = {};
        var keys = Object.keys(values);
        var keysLength = keys.length;
        for (var i = 0; i < keysLength; i++) {
            var key = keys[i];
            var attribute = values[key];
            var size = mustBeInteger_1.default('size', attribute.size);
            var varName = getAttribVarName_1.default(attribute, key);
            result[varName] = { glslType: glslAttribType_1.default(key, size) };
        }
        return result;
    }
    var GraphicsProgramBuilder = (function () {
        function GraphicsProgramBuilder(primitive) {
            this.aMeta = {};
            this.uParams = {};
            if (primitive) {
                var attributes = primitive.attributes;
                var keys = Object.keys(attributes);
                for (var i = 0, iLength = keys.length; i < iLength; i++) {
                    var key = keys[i];
                    var attribute = attributes[key];
                    this.attribute(key, attribute.size);
                }
            }
        }
        GraphicsProgramBuilder.prototype.attribute = function (name, size) {
            mustBeString_1.default('name', name);
            mustBeInteger_1.default('size', size);
            this.aMeta[name] = { size: size };
            return this;
        };
        GraphicsProgramBuilder.prototype.uniform = function (name, type) {
            mustBeString_1.default('name', name);
            mustBeString_1.default('type', type);
            this.uParams[name] = { glslType: type };
            return this;
        };
        GraphicsProgramBuilder.prototype.build = function () {
            var aParams = computeAttribParams(this.aMeta);
            var vColor = vColorRequired_1.default(aParams, this.uParams);
            var vLight = vLightRequired_1.default(aParams, this.uParams);
            return new SmartGraphicsProgram_1.default(aParams, this.uParams, vColor, vLight);
        };
        GraphicsProgramBuilder.prototype.vertexShader = function () {
            var aParams = computeAttribParams(this.aMeta);
            var vColor = vColorRequired_1.default(aParams, this.uParams);
            var vLight = vLightRequired_1.default(aParams, this.uParams);
            return vertexShader_1.default(aParams, this.uParams, vColor, vLight);
        };
        GraphicsProgramBuilder.prototype.fragmentShader = function () {
            var aParams = computeAttribParams(this.aMeta);
            var vColor = vColorRequired_1.default(aParams, this.uParams);
            var vLight = vLightRequired_1.default(aParams, this.uParams);
            return fragmentShader_1.default(aParams, this.uParams, vColor, vLight);
        };
        return GraphicsProgramBuilder;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GraphicsProgramBuilder;
});
