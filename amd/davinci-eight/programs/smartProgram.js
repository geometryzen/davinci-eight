define(["require", "exports", '../scene/MonitorList', '../programs/fragmentShader', './shaderProgram', '../core/Symbolic', '../programs/vertexShader'], function (require, exports, MonitorList, fragmentShader, shaderProgram, Symbolic, vertexShader) {
    function vLightRequired(uniforms) {
        return !!uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
    }
    function vColorRequired(attributes, uniforms) {
        return !!attributes[Symbolic.ATTRIBUTE_COLOR] || !!uniforms[Symbolic.UNIFORM_COLOR];
    }
    /**
     *
     */
    var smartProgram = function (monitors, attributes, uniforms, bindings) {
        MonitorList.verify('monitors', monitors, function () { return "smartProgram"; });
        if (!attributes) {
            throw new Error("The attributes parameter is required for smartProgram.");
        }
        if (!uniforms) {
            throw new Error("The uniformsList parameter is required for smartProgram.");
        }
        var vColor = vColorRequired(attributes, uniforms);
        var vLight = vLightRequired(uniforms);
        var innerProgram = shaderProgram(monitors, vertexShader(attributes, uniforms, vColor, vLight), fragmentShader(attributes, uniforms, vColor, vLight), bindings);
        var self = {
            get programId() {
                return innerProgram.programId;
            },
            get attributes() {
                return innerProgram.attributes;
            },
            get uniforms() {
                return innerProgram.uniforms;
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
            contextLoss: function (canvasId) {
                return innerProgram.contextLoss(canvasId);
            },
            use: function (canvasId) {
                return innerProgram.use(canvasId);
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
            uniformMatrix1: function (name, transpose, matrix) {
                return innerProgram.uniformMatrix1(name, transpose, matrix);
            },
            uniformMatrix2: function (name, transpose, matrix) {
                return innerProgram.uniformMatrix2(name, transpose, matrix);
            },
            uniformMatrix3: function (name, transpose, matrix) {
                return innerProgram.uniformMatrix3(name, transpose, matrix);
            },
            uniformMatrix4: function (name, transpose, matrix) {
                return innerProgram.uniformMatrix4(name, transpose, matrix);
            },
            uniformVector1: function (name, vector) {
                return innerProgram.uniformVector1(name, vector);
            },
            uniformVector2: function (name, vector) {
                return innerProgram.uniformVector2(name, vector);
            },
            uniformVector3: function (name, vector) {
                return innerProgram.uniformVector3(name, vector);
            },
            uniformVector4: function (name, vector) {
                return innerProgram.uniformVector4(name, vector);
            }
        };
        return self;
    };
    return smartProgram;
});
