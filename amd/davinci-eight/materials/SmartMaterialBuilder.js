define(["require", "exports", '../core/getAttribVarName', '../core/getUniformVarName', '../programs/glslAttribType', '../checks/mustBeInteger', '../checks/mustBeString', '../materials/SmartMaterial', '../programs/vColorRequired', '../programs/vLightRequired'], function (require, exports, getAttribVarName, getUniformVarName, glslAttribType, mustBeInteger, mustBeString, SmartMaterial, vColorRequired, vLightRequired) {
    // FIXME: Probably shuld do this calculation
    function computeAttribParams(values) {
        var result = {};
        var keys = Object.keys(values);
        var keysLength = keys.length;
        for (var i = 0; i < keysLength; i++) {
            var key = keys[i];
            var attribute = values[key];
            var size = mustBeInteger('size', attribute.size);
            var varName = getAttribVarName(attribute, key);
            result[varName] = { glslType: glslAttribType(key, size) };
        }
        return result;
    }
    function updateUniformMeta(uniforms) {
        uniforms.forEach(function (values) {
            var keys = Object.keys(values);
            var keysLength = keys.length;
            for (var i = 0; i < keysLength; i++) {
                var key = keys[i];
                var uniform = values[key];
                var varName = getUniformVarName(uniform, key);
                this.uParams[varName] = { glslType: uniform.glslType };
            }
        });
    }
    /**
     * @class SmartMaterialBuilder
     */
    var SmartMaterialBuilder = (function () {
        /**
         * @class SmartMaterialBuilder
         * @constructor
         * @param elements {Geometry} Optional.
         */
        function SmartMaterialBuilder(elements) {
            this.aMeta = {};
            this.uParams = {};
            if (elements) {
                var attributes = elements.meta.attributes;
                var keys = Object.keys(attributes);
                var keysLength = keys.length;
                for (var i = 0; i < keysLength; i++) {
                    var key = keys[i];
                    var attribute = attributes[key];
                    this.attribute(key, attribute.size, attribute.name);
                }
            }
        }
        SmartMaterialBuilder.prototype.attribute = function (key, size, name) {
            mustBeString('key', key);
            mustBeInteger('size', size);
            this.aMeta[key] = { size: size };
            if (name) {
                mustBeString('name', name);
                this.aMeta[key].name = name;
            }
            return this;
        };
        SmartMaterialBuilder.prototype.uniform = function (key, type, name) {
            mustBeString('key', key);
            mustBeString('type', type); // Must also be a valid GLSL type.
            this.uParams[key] = { glslType: type };
            if (name) {
                mustBeString('name', name);
                this.uParams[key].name = name;
            }
            return this;
        };
        SmartMaterialBuilder.prototype.build = function (contexts) {
            // FIXME: Push this calculation down into the functions.
            // Then the data structures are based on size.
            // uniforms based on numeric type?
            var aParams = computeAttribParams(this.aMeta);
            var vColor = vColorRequired(aParams, this.uParams);
            var vLight = vLightRequired(aParams, this.uParams);
            return new SmartMaterial(contexts, aParams, this.uParams, vColor, vLight);
        };
        return SmartMaterialBuilder;
    })();
    return SmartMaterialBuilder;
});
