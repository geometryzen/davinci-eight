define(["require", "exports", '../core/getAttribVarName', '../core/getUniformVarName', '../programs/glslAttribType', '../checks/mustBeInteger', '../checks/mustBeString', '../materials/SmartGraphicsProgram', '../programs/vColorRequired', '../programs/vLightRequired'], function (require, exports, getAttribVarName, getUniformVarName, glslAttribType, mustBeInteger, mustBeString, SmartGraphicsProgram, vColorRequired, vLightRequired) {
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
     * @class GraphicsProgramBuilder
     */
    var GraphicsProgramBuilder = (function () {
        /**
         * Constructs the <code>GraphicsProgramBuilder</code>.
         * The lifecycle for using this generator is
         * <ol>
         * <li>Create an instance of the <code>GraphicsProgramBuilder.</code></li>
         * <li>Make calls to the <code>attribute</code> and/or <code>uniform</code> methods in any order.</li>
         * <li>Call the <code>build</code> method to create the <code>GraphicsProgram</code>.</li>
         * </ol>
         * The same builder instance may be reused to create other programs.
         * @class GraphicsProgramBuilder
         * @constructor
         * @param [primitive] {Primitive}
         */
        function GraphicsProgramBuilder(primitive) {
            /**
             * @property aMeta
             * @private
             */
            this.aMeta = {};
            /**
             * @property uParams
             * @private
             */
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
        /**
         * Declares that the material should have an `attribute` with the specified name and size.
         * @method attribute
         * @param name {string}
         * @param size {number}
         * @return {GraphicsProgramBuilder}
         * @chainable
         */
        GraphicsProgramBuilder.prototype.attribute = function (name, size) {
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
         * @return {GraphicsProgramBuilder}
         * @chainable
         */
        GraphicsProgramBuilder.prototype.uniform = function (name, type) {
            mustBeString('name', name);
            mustBeString('type', type); // TODO: Must also be a valid GLSL uniform type.
            this.uParams[name] = { glslType: type };
            return this;
        };
        /**
         * Creates a GraphicsProgram. This may contain multiple <code>WebGLProgram</code>(s),
         * one for each context supplied. The generated program is compiled and linked
         * for each context in response to context gain and loss events.
         * @method build
         * @param contexts {IContextMonitor[]}
         * @return {GraphicsProgram}
         */
        GraphicsProgramBuilder.prototype.build = function (contexts) {
            // FIXME: Push this calculation down into the functions.
            // Then the data structures are based on size.
            // uniforms based on numeric type?
            var aParams = computeAttribParams(this.aMeta);
            var vColor = vColorRequired(aParams, this.uParams);
            var vLight = vLightRequired(aParams, this.uParams);
            return new SmartGraphicsProgram(contexts, aParams, this.uParams, vColor, vLight);
        };
        return GraphicsProgramBuilder;
    })();
    return GraphicsProgramBuilder;
});
