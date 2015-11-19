import AttribMetaInfo = require('../core/AttribMetaInfo')
import getAttribVarName = require('../core/getAttribVarName')
import getUniformVarName = require('../core/getUniformVarName')
import mustBeBoolean = require('../checks/mustBeBoolean')
import mustBeDefined = require('../checks/mustBeDefined')
import GraphicsProgramSymbols = require('../core/GraphicsProgramSymbols')
import UniformMetaInfo = require('../core/UniformMetaInfo')

function getUniformCodeName(uniforms: { [name: string]: UniformMetaInfo }, name: string) {
    return getUniformVarName(uniforms[name], name)
}

let SPACE = ' '
let ATTRIBUTE = 'attribute' + SPACE
let UNIFORM = 'uniform' + SPACE
let COMMA = ',' + SPACE
let SEMICOLON = ';'
let LPAREN = '('
let RPAREN = ')'
let TIMES = SPACE + '*' + SPACE
let ASSIGN = SPACE + '=' + SPACE
let DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME = "directionalLightCosineFactor"

function indent(n: number): string {
    return SPACE + SPACE
}

/**
 * Generates a vertex shader.
 */
function vertexShader(attributes: { [name: string]: AttribMetaInfo }, uniforms: { [name: string]: UniformMetaInfo }, vColor: boolean, vLight: boolean): string {

    mustBeDefined('attributes', attributes)
    mustBeDefined('uniforms', uniforms)
    mustBeBoolean('vColor', vColor)
    mustBeBoolean('vLight', vLight)

    var lines: string[] = []
    lines.push("// generated vertex shader")
    for (var aName in attributes) {
        lines.push(ATTRIBUTE + attributes[aName].glslType + SPACE + getAttribVarName(attributes[aName], aName) + SEMICOLON)
    }
    for (var uName in uniforms) {
        lines.push(UNIFORM + uniforms[uName].glslType + SPACE + getUniformCodeName(uniforms, uName) + SEMICOLON)
    }
    if (vColor) {
        lines.push("varying highp vec4 vColor;")
    }
    if (vLight) {
        lines.push("varying highp vec3 vLight;");
    }
    lines.push("void main(void) {")
    let glPosition: string[] = []
    glPosition.unshift(SEMICOLON)

    if (attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION]) {
        switch (attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION].glslType) {
            case 'float': {
                // This case would be unusual; just providing an x-coordinate.
                // We must provide defaults for the y-, z-, and w-coordinates.
                glPosition.unshift(RPAREN)
                glPosition.unshift('1.0')
                glPosition.unshift(COMMA)
                glPosition.unshift('0.0')
                glPosition.unshift(COMMA)
                glPosition.unshift('0.0')
                glPosition.unshift(COMMA)
                glPosition.unshift(getAttribVarName(attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], GraphicsProgramSymbols.ATTRIBUTE_POSITION))
                glPosition.unshift(LPAREN)
                glPosition.unshift('vec4')
                break;
            }
            case 'vec2': {
                // This case happens when the user wants to work in 2D.
                // We must provide a value for the homogeneous w-coordinate,
                // as well as the z-coordinate.
                glPosition.unshift(RPAREN)
                glPosition.unshift('1.0')
                glPosition.unshift(COMMA)
                glPosition.unshift('0.0')
                glPosition.unshift(COMMA)
                glPosition.unshift(getAttribVarName(attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], GraphicsProgramSymbols.ATTRIBUTE_POSITION))
                glPosition.unshift(LPAREN)
                glPosition.unshift('vec4')
                break;
            }
            case 'vec3': {
                // This is probably the most common case, 3D but only x-, y-, z-coordinates.
                // We must provide a value for the homogeneous w-coordinate.
                glPosition.unshift(RPAREN)
                glPosition.unshift('1.0')
                glPosition.unshift(COMMA)
                glPosition.unshift(getAttribVarName(attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], GraphicsProgramSymbols.ATTRIBUTE_POSITION))
                glPosition.unshift(LPAREN)
                glPosition.unshift('vec4')
                break;
            }
            case 'vec4': {
                // This happens when the use is working in homodeneous coordinates.
                // We don't need to use the constructor function at all.
                glPosition.unshift(getAttribVarName(attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], GraphicsProgramSymbols.ATTRIBUTE_POSITION))
                break;
            }
        }
    }
    else {
        glPosition.unshift("vec4(0.0, 0.0, 0.0, 1.0)")
    }

    // Reflections are applied first.
    if (uniforms[GraphicsProgramSymbols.UNIFORM_REFLECTION_ONE_MATRIX]) {
        glPosition.unshift(TIMES)
        glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols.UNIFORM_REFLECTION_ONE_MATRIX))
    }
    if (uniforms[GraphicsProgramSymbols.UNIFORM_REFLECTION_TWO_MATRIX]) {
        glPosition.unshift(TIMES)
        glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols.UNIFORM_REFLECTION_TWO_MATRIX))
    }
    if (uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX]) {
        glPosition.unshift(TIMES)
        glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX))
    }
    if (uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX]) {
        glPosition.unshift(TIMES)
        glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX))
    }
    if (uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX]) {
        glPosition.unshift(TIMES)
        glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX))
    }
    glPosition.unshift(ASSIGN)
    glPosition.unshift("gl_Position")
    glPosition.unshift('  ')
    lines.push(glPosition.join(''))

    if (uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE]) {
        lines.push("  gl_PointSize = " + getUniformCodeName(uniforms, GraphicsProgramSymbols.UNIFORM_POINT_SIZE) + ";")
    }

    if (vColor) {
        if (attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR]) {
            let colorAttribVarName = getAttribVarName(attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR], GraphicsProgramSymbols.ATTRIBUTE_COLOR)
            switch (attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR].glslType) {
                case 'vec4': {
                    lines.push("  vColor = " + colorAttribVarName + SEMICOLON)
                }
                    break
                case 'vec3': {
                    lines.push("  vColor = vec4(" + colorAttribVarName + ", 1.0);")
                }
                    break
                default: {
                    throw new Error("Unexpected type for color attribute: " + attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR].glslType)
                }
            }
        }
        else if (uniforms[GraphicsProgramSymbols.UNIFORM_COLOR]) {
            let colorUniformVarName = getUniformCodeName(uniforms, GraphicsProgramSymbols.UNIFORM_COLOR)
            switch (uniforms[GraphicsProgramSymbols.UNIFORM_COLOR].glslType) {
                case 'vec4': {
                    lines.push("  vColor = " + colorUniformVarName + SEMICOLON)
                }
                    break
                case 'vec3': {
                    lines.push("  vColor = vec4(" + colorUniformVarName + ", 1.0);")
                }
                    break
                default: {
                    throw new Error("Unexpected type for color uniform: " + uniforms[GraphicsProgramSymbols.UNIFORM_COLOR].glslType)
                }
            }
        }
        else {
            lines.push("  vColor = vec4(1.0, 1.0, 1.0, 1.0);")
        }
    }

    if (vLight) {
        if (uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] && uniforms[GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] && attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL]) {
            lines.push("  vec3 L = normalize(" + getUniformCodeName(uniforms, GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION) + ");")
            lines.push("  vec3 N = normalize(" + getUniformCodeName(uniforms, GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX) + " * " + getAttribVarName(attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL], GraphicsProgramSymbols.ATTRIBUTE_NORMAL) + ");")
            lines.push("  // The minus sign arises because L is the light direction, so we need dot(N, -L) = -dot(N, L)")
            lines.push("  float " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " = max(-dot(N, L), 0.0);")
            if (uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT]) {
                lines.push("  vLight = " + getUniformCodeName(uniforms, GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT) + " + " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + getUniformCodeName(uniforms, GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR) + ";")
            }
            else {
                lines.push("  vLight = " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + getUniformCodeName(uniforms, GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR) + ";")
            }
        }
        else {
            if (uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT]) {
                lines.push("  vLight = " + getUniformCodeName(uniforms, GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT) + ";")
            }
            else {
                lines.push("  vLight = vec3(1.0, 1.0, 1.0);")
            }
        }
    }
    lines.push("}")

    let code = lines.join("\n")
    return code
}

export = vertexShader
