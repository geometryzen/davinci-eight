define(["require", "exports", './shaderProgram', '../core/Symbolic', '../checks/isDefined', '../programs/vertexShader', '../programs/fragmentShader'], function (require, exports, shaderProgram, Symbolic, isDefined, vertexShader, fragmentShader) {
    function vLightRequired(uniforms) {
        return !!uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
    }
    function vColorRequired(attributes, uniforms) {
        return !!attributes[Symbolic.ATTRIBUTE_COLOR] || !!uniforms[Symbolic.UNIFORM_COLOR];
    }
    /**
     *
     */
    var smartProgram = function (attributes, uniformsList) {
        if (!isDefined(attributes)) {
            throw new Error("The attributes parameter is required for smartProgram.");
        }
        if (uniformsList) {
        }
        else {
            throw new Error("The uniformsList parameter is required for smartProgram.");
        }
        var uniforms = {};
        uniformsList.forEach(function (uniformsElement) {
            for (var name in uniformsElement) {
                uniforms[name] = uniformsElement[name];
            }
        });
        var vColor = vColorRequired(attributes, uniforms);
        var vLight = vLightRequired(uniforms);
        var innerProgram = shaderProgram(vertexShader(attributes, uniforms, vColor, vLight), fragmentShader(attributes, uniforms, vColor, vLight));
        var publicAPI = {
            get program() {
                return innerProgram.program;
            },
            get programId() {
                return innerProgram.programId;
            },
            get attributeLocations() {
                return innerProgram.attributeLocations;
            },
            get uniformLocations() {
                return innerProgram.uniformLocations;
            },
            get uniformSetters() {
                return innerProgram.uniformSetters;
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
            contextGain: function (context) {
                return innerProgram.contextGain(context);
            },
            contextLoss: function () {
                return innerProgram.contextLoss();
            },
            hasContext: function () {
                return innerProgram.hasContext();
            },
            use: function () {
                return innerProgram.use();
            },
            setAttributes: function (values) {
                return innerProgram.setAttributes(values);
            },
            setUniforms: function (values) {
                return innerProgram.setUniforms(values);
            }
        };
        return publicAPI;
    };
    return smartProgram;
});
