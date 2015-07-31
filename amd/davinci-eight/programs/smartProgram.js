define(["require", "exports", './shaderProgram', '../core/Symbolic'], function (require, exports, shaderProgram, Symbolic) {
    var SPACE = ' ';
    var ATTRIBUTE = 'attribute' + SPACE;
    var UNIFORM = 'uniform' + SPACE;
    var COMMA = ',' + SPACE;
    var SEMICOLON = ';';
    var LPAREN = '(';
    var RPAREN = ')';
    var TIMES = SPACE + '*' + SPACE;
    var ASSIGN = SPACE + '=' + SPACE;
    var DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME = "directionalLightCosineFactor";
    function vLightRequired(uniforms) {
        return !!uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
    }
    /**
     *
     */
    var vertexShader = function (attributes, uniforms, vLight) {
        var lines = [];
        for (name in attributes) {
            lines.push(ATTRIBUTE + attributes[name].glslType + SPACE + attributes[name].name + SEMICOLON);
        }
        for (name in uniforms) {
            lines.push(UNIFORM + uniforms[name].glslType + SPACE + uniforms[name].name + SEMICOLON);
        }
        lines.push("varying highp vec4 vColor;");
        if (vLight) {
            lines.push("varying highp vec3 vLight;");
        }
        lines.push("void main(void) {");
        var glPosition = [];
        glPosition.unshift(SEMICOLON);
        glPosition.unshift(RPAREN);
        glPosition.unshift("1.0");
        glPosition.unshift(COMMA);
        glPosition.unshift(attributes[Symbolic.ATTRIBUTE_POSITION].name);
        glPosition.unshift(LPAREN);
        glPosition.unshift("vec4");
        if (uniforms[Symbolic.UNIFORM_MODEL_MATRIX]) {
            glPosition.unshift(TIMES);
            glPosition.unshift(uniforms[Symbolic.UNIFORM_MODEL_MATRIX].name);
        }
        if (uniforms[Symbolic.UNIFORM_VIEW_MATRIX]) {
            glPosition.unshift(TIMES);
            glPosition.unshift(uniforms[Symbolic.UNIFORM_VIEW_MATRIX].name);
        }
        if (uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX]) {
            glPosition.unshift(TIMES);
            glPosition.unshift(uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX].name);
        }
        glPosition.unshift(ASSIGN);
        glPosition.unshift("gl_Position");
        lines.push(glPosition.join(''));
        var vColorAssignLines = [];
        if (attributes[Symbolic.ATTRIBUTE_COLOR]) {
            switch (attributes[Symbolic.ATTRIBUTE_COLOR].glslType) {
                case 'vec4':
                    {
                        lines.push("  vColor = " + attributes[Symbolic.ATTRIBUTE_COLOR].name + SEMICOLON);
                    }
                    break;
                case 'vec3':
                    {
                        lines.push("  vColor = vec4(" + attributes[Symbolic.ATTRIBUTE_COLOR].name + ", 1.0);");
                    }
                    break;
                default:
                    {
                        throw new Error("Unexpected type for color attribute: " + attributes[Symbolic.ATTRIBUTE_COLOR].glslType);
                    }
            }
        }
        else if (uniforms[Symbolic.UNIFORM_COLOR]) {
            switch (uniforms[Symbolic.UNIFORM_COLOR].glslType) {
                case 'vec4':
                    {
                        lines.push("  vColor = " + uniforms[Symbolic.UNIFORM_COLOR].name + SEMICOLON);
                    }
                    break;
                case 'vec3':
                    {
                        lines.push("  vColor = vec4(" + uniforms[Symbolic.UNIFORM_COLOR].name + ", 1.0);");
                    }
                    break;
                default:
                    {
                        throw new Error("Unexpected type for color uniform: " + uniforms[Symbolic.UNIFORM_COLOR].glslType);
                    }
            }
        }
        lines.push(vColorAssignLines.join(''));
        if (vLight) {
            if (uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] && uniforms[Symbolic.UNIFORM_NORMAL_MATRIX] && attributes[Symbolic.ATTRIBUTE_NORMAL]) {
                lines.push("  vec3 L = normalize(" + uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION].name + ");");
                lines.push("  vec3 N = normalize(" + uniforms[Symbolic.UNIFORM_NORMAL_MATRIX].name + " * " + attributes[Symbolic.ATTRIBUTE_NORMAL].name + ");");
                lines.push("  float " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " = max(dot(N, L), 0.0);");
                if (uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT]) {
                    lines.push("  vLight = " + uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT].name + " + " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR].name + ";");
                }
                else {
                    lines.push("  vLight = " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR].name + ";");
                }
            }
            else {
                if (uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT]) {
                    lines.push("  vLight = " + uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT].name + ";");
                }
                else {
                    lines.push("  vLight = vec3(1.0, 1.0, 1.0);");
                }
            }
        }
        lines.push("  gl_PointSize = 6.0;");
        lines.push("}");
        var code = lines.join("\n");
        return code;
    };
    /**
     *
     */
    var fragmentShader = function (attributes, uniforms, vColor, vLight) {
        var lines = [];
        lines.push("varying highp vec4 vColor;");
        if (vLight) {
            lines.push("varying highp vec3 vLight;");
        }
        lines.push("void main(void) {");
        if (vLight) {
            if (vColor) {
                lines.push("  gl_FragColor = vec4(vColor.xyz * vLight, vColor.a);");
            }
            else {
                lines.push("  gl_FragColor = vec4(vLight, 1.0);");
            }
        }
        else {
            if (vColor) {
                lines.push("  gl_FragColor = vColor;");
            }
            else {
                lines.push("  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);");
            }
        }
        lines.push("}");
        var code = lines.join("\n");
        return code;
    };
    /**
     *
     */
    var smartProgram = function (attributes, uniformsList) {
        if (attributes) {
        }
        else {
            throw new Error("The attributes parameter is required for smartProgram.");
        }
        if (uniformsList) {
        }
        else {
            throw new Error("The uniforms parameter is required for smartProgram.");
        }
        var uniforms = {};
        uniformsList.forEach(function (uniformsElement) {
            for (var name in uniformsElement) {
                uniforms[name] = uniformsElement[name];
            }
        });
        var vColor = true;
        var vLight = vLightRequired(uniforms);
        var innerProgram = shaderProgram(vertexShader(attributes, uniforms, vLight), fragmentShader(attributes, uniforms, vColor, vLight));
        var publicAPI = {
            get attributes() {
                return innerProgram.attributes;
            },
            get constants() {
                return innerProgram.constants;
            },
            get uniforms() {
                return innerProgram.uniforms;
            },
            get varyings() {
                return innerProgram.varyings;
            },
            get program() {
                return innerProgram.program;
            },
            get programId() {
                return innerProgram.programId;
            },
            get vertexShader() {
                return innerProgram.vertexShader;
            },
            get fragmentShader() {
                return innerProgram.fragmentShader;
            },
            contextFree: function () {
                return innerProgram.contextFree();
            },
            contextGain: function (context, contextGainId) {
                return innerProgram.contextGain(context, contextGainId);
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
            attributeLocation: function (name) {
                return innerProgram.attributeLocation(name);
            },
            uniformLocation: function (name) {
                return innerProgram.uniformLocation(name);
            }
        };
        return publicAPI;
    };
    return smartProgram;
});
