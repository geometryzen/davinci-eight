define(["require", "exports", '../core/getAttribVarName', '../core/getUniformVarName', '../programs/glslAttribType', '../checks/mustBeInteger', '../checks/mustBeString', '../materials/SmartMaterial', '../programs/vColorRequired', '../programs/vLightRequired'], function (require, exports, getAttribVarName, getUniformVarName, glslAttribType, mustBeInteger, mustBeString, SmartMaterial, vColorRequired, vLightRequired) {
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
         * @param elements [GeometryElements]
         */
        function SmartMaterialBuilder(elements) {
            this.aMeta = {};
            this.uParams = {};
            if (elements) {
                var attributes = elements.attributes;
                var keys = Object.keys(attributes);
                var keysLength = keys.length;
                for (var i = 0; i < keysLength; i++) {
                    var key = keys[i];
                    var attribute = attributes[key];
                    this.attribute(key, attribute.size);
                }
            }
        }
        /**
         * Declares that the material should have an `attribute` with the specified name and size.
         * @method attribute
         * @param name {string}
         * @param size {number}
         */
        SmartMaterialBuilder.prototype.attribute = function (name, size) {
            mustBeString('name', name);
            mustBeInteger('size', size);
            this.aMeta[name] = { size: size };
            return this;
        };
        /**
         * Declares that the material should have a `uniform` with the specified name and type.
         * @method uniform
         * @param name {string}
         * @param type {string} The GLSL type. e.g. 'float', 'vec3', 'mat2'
         */
        SmartMaterialBuilder.prototype.uniform = function (name, type) {
            mustBeString('name', name);
            mustBeString('type', type); // Must also be a valid GLSL type.
            this.uParams[name] = { glslType: type };
            return this;
        };
        /**
         * @method build
         * @param contexts {IContextMonitor[]}
         * @return {Material}
         */
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
