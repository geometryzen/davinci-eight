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
        var self = {
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
            contextFree: function () {
                return innerProgram.contextFree();
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
            },
            uniform1f: function (name, x, picky) {
                return innerProgram.uniform1f(name, x, picky);
            },
            uniform1fv: function (name, value, picky) {
                return innerProgram.uniform1fv(name, value, picky);
            },
            uniform2f: function (name, x, y, picky) {
                return innerProgram.uniform2f(name, x, y, picky);
            },
            uniform2fv: function (name, value, picky) {
                return innerProgram.uniform2fv(name, value, picky);
            },
            uniform3f: function (name, x, y, z, picky) {
                return innerProgram.uniform3f(name, x, y, z, picky);
            },
            uniform3fv: function (name, value, picky) {
                return innerProgram.uniform3fv(name, value, picky);
            },
            uniform4f: function (name, x, y, z, w, picky) {
                return innerProgram.uniform4f(name, x, y, z, w, picky);
            },
            uniform4fv: function (name, value, picky) {
                return innerProgram.uniform4fv(name, value, picky);
            },
            uniformMatrix2fv: function (name, transpose, matrix, picky) {
                return innerProgram.uniformMatrix2fv(name, transpose, matrix, picky);
            },
            uniformMatrix3fv: function (name, transpose, matrix, picky) {
                return innerProgram.uniformMatrix3fv(name, transpose, matrix, picky);
            },
            uniformMatrix4fv: function (name, transpose, matrix, picky) {
                return innerProgram.uniformMatrix4fv(name, transpose, matrix, picky);
            }
        };
        return self;
    };
    return smartProgram;
});
