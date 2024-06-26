import { mustBeBoolean } from "../checks/mustBeBoolean";
import { mustBeDefined } from "../checks/mustBeDefined";
import { config } from "../config";
import { AttribMetaInfo } from "../core/AttribMetaInfo";
import { getAttribVarName } from "../core/getAttribVarName";
import { getUniformVarName } from "../core/getUniformVarName";
import { GraphicsProgramSymbols as GPS } from "../core/GraphicsProgramSymbols";
import { UniformMetaInfo } from "../core/UniformMetaInfo";
import { GLSLESVersion } from "./glslVersion";

/**
 * @hidden
 */
function getUniformCodeName(uniforms: { [name: string]: UniformMetaInfo }, name: string) {
    return getUniformVarName(uniforms[name], name);
}

/**
 * @hidden
 */
function getAttributeModifier(version: GLSLESVersion) {
    if (version === GLSLESVersion.ThreeHundred) {
        return "in";
    } else {
        return "attribute";
    }
}

/**
 * @hidden
 */
function getVertexShaderVaryingModifier(version: GLSLESVersion) {
    if (version === GLSLESVersion.ThreeHundred) {
        return "out";
    } else {
        return "varying";
    }
}

/**
 * @hidden
 */
const SPACE = " ";
/**
 * @hidden
 */
const UNIFORM = "uniform" + SPACE;
/**
 * @hidden
 */
const COMMA = "," + SPACE;
/**
 * @hidden
 */
const SEMICOLON = ";";
/**
 * @hidden
 */
const LPAREN = "(";
/**
 * @hidden
 */
const RPAREN = ")";
/**
 * @hidden
 */
const TIMES = SPACE + "*" + SPACE;
/**
 * @hidden
 */
const ASSIGN = SPACE + "=" + SPACE;
/**
 * @hidden
 */
const DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME = "directionalLightCosineFactor";

/**
 * Generates a vertex shader.
 * @hidden
 */
export function vertexShaderSrc(attributes: { [name: string]: AttribMetaInfo }, uniforms: { [name: string]: UniformMetaInfo }, vColor: boolean, vCoords: boolean, vLight: boolean, version: GLSLESVersion): string {
    mustBeDefined("attributes", attributes);
    mustBeDefined("uniforms", uniforms);
    mustBeBoolean(GPS.VARYING_COLOR, vColor);
    mustBeBoolean(GPS.VARYING_COORDS, vCoords);
    mustBeBoolean(GPS.VARYING_LIGHT, vLight);
    mustBeDefined("version", version);

    const lines: string[] = [];
    if (version === GLSLESVersion.ThreeHundred) {
        lines.push("#version 300 es");
    }
    lines.push(`// vertex shader generated by ${config.MARKETING_NAME}`);
    // The precision is implicitly highp for vertex shaders.
    // So there is no need to add preamble for changing the precision unless
    // we want to lower the precision.
    for (const aName in attributes) {
        // eslint-disable-next-line no-prototype-builtins
        if (attributes.hasOwnProperty(aName)) {
            lines.push(`${getAttributeModifier(version)} ${attributes[aName].glslType} ${getAttribVarName(attributes[aName], aName)};`);
        }
    }
    for (const uName in uniforms) {
        // eslint-disable-next-line no-prototype-builtins
        if (uniforms.hasOwnProperty(uName)) {
            switch (uniforms[uName].glslType) {
                case "sampler2D": {
                    break;
                }
                default: {
                    lines.push(UNIFORM + uniforms[uName].glslType + SPACE + getUniformCodeName(uniforms, uName) + SEMICOLON);
                }
            }
        }
    }
    if (vColor) {
        lines.push(`${getVertexShaderVaryingModifier(version)} highp vec4 ${GPS.VARYING_COLOR};`);
    }
    if (vCoords) {
        lines.push(`${getVertexShaderVaryingModifier(version)} highp vec2 ${GPS.VARYING_COORDS};`);
    }
    if (vLight) {
        lines.push(`${getVertexShaderVaryingModifier(version)} highp vec3 ${GPS.VARYING_LIGHT};`);
    }
    lines.push("void main(void) {");
    const glPosition: string[] = [];
    glPosition.unshift(SEMICOLON);

    if (attributes[GPS.ATTRIBUTE_POSITION]) {
        switch (attributes[GPS.ATTRIBUTE_POSITION].glslType) {
            case "float": {
                // This case would be unusual; just providing an x-coordinate.
                // We must provide defaults for the y-, z-, and w-coordinates.
                glPosition.unshift(RPAREN);
                glPosition.unshift("1.0");
                glPosition.unshift(COMMA);
                glPosition.unshift("0.0");
                glPosition.unshift(COMMA);
                glPosition.unshift("0.0");
                glPosition.unshift(COMMA);
                glPosition.unshift(getAttribVarName(attributes[GPS.ATTRIBUTE_POSITION], GPS.ATTRIBUTE_POSITION));
                glPosition.unshift(LPAREN);
                glPosition.unshift("vec4");
                break;
            }
            case "vec2": {
                // This case happens when the user wants to work in 2D.
                // We must provide a value for the homogeneous w-coordinate,
                // as well as the z-coordinate.
                glPosition.unshift(RPAREN);
                glPosition.unshift("1.0");
                glPosition.unshift(COMMA);
                glPosition.unshift("0.0");
                glPosition.unshift(COMMA);
                glPosition.unshift(getAttribVarName(attributes[GPS.ATTRIBUTE_POSITION], GPS.ATTRIBUTE_POSITION));
                glPosition.unshift(LPAREN);
                glPosition.unshift("vec4");
                break;
            }
            case "vec3": {
                // This is probably the most common case, 3D but only x-, y-, z-coordinates.
                // We must provide a value for the homogeneous w-coordinate.
                glPosition.unshift(RPAREN);
                glPosition.unshift("1.0");
                glPosition.unshift(COMMA);
                glPosition.unshift(getAttribVarName(attributes[GPS.ATTRIBUTE_POSITION], GPS.ATTRIBUTE_POSITION));
                glPosition.unshift(LPAREN);
                glPosition.unshift("vec4");
                break;
            }
            case "vec4": {
                // This happens when the use is working in homodeneous coordinates.
                // We don't need to use the constructor function at all.
                glPosition.unshift(getAttribVarName(attributes[GPS.ATTRIBUTE_POSITION], GPS.ATTRIBUTE_POSITION));
                break;
            }
        }
    } else {
        glPosition.unshift("vec4(0.0, 0.0, 0.0, 1.0)");
    }

    // Reflections are applied first.
    if (uniforms[GPS.UNIFORM_REFLECTION_ONE_MATRIX]) {
        glPosition.unshift(TIMES);
        glPosition.unshift(getUniformCodeName(uniforms, GPS.UNIFORM_REFLECTION_ONE_MATRIX));
    }
    if (uniforms[GPS.UNIFORM_REFLECTION_TWO_MATRIX]) {
        glPosition.unshift(TIMES);
        glPosition.unshift(getUniformCodeName(uniforms, GPS.UNIFORM_REFLECTION_TWO_MATRIX));
    }
    if (uniforms[GPS.UNIFORM_MODEL_MATRIX]) {
        glPosition.unshift(TIMES);
        glPosition.unshift(getUniformCodeName(uniforms, GPS.UNIFORM_MODEL_MATRIX));
    }
    if (uniforms[GPS.UNIFORM_VIEW_MATRIX]) {
        glPosition.unshift(TIMES);
        glPosition.unshift(getUniformCodeName(uniforms, GPS.UNIFORM_VIEW_MATRIX));
    }
    if (uniforms[GPS.UNIFORM_PROJECTION_MATRIX]) {
        glPosition.unshift(TIMES);
        glPosition.unshift(getUniformCodeName(uniforms, GPS.UNIFORM_PROJECTION_MATRIX));
    }
    glPosition.unshift(ASSIGN);
    glPosition.unshift("gl_Position");
    glPosition.unshift("  ");
    lines.push(glPosition.join(""));

    if (uniforms[GPS.UNIFORM_POINT_SIZE]) {
        lines.push("  gl_PointSize = " + getUniformCodeName(uniforms, GPS.UNIFORM_POINT_SIZE) + ";");
    }

    if (vColor) {
        if (attributes[GPS.ATTRIBUTE_COLOR]) {
            const colorAttribVarName = getAttribVarName(attributes[GPS.ATTRIBUTE_COLOR], GPS.ATTRIBUTE_COLOR);
            switch (attributes[GPS.ATTRIBUTE_COLOR].glslType) {
                case "vec4": {
                    lines.push(`  ${GPS.VARYING_COLOR} = ` + colorAttribVarName + SEMICOLON);
                    break;
                }
                case "vec3": {
                    if (uniforms[GPS.UNIFORM_OPACITY]) {
                        lines.push(`  ${GPS.VARYING_COLOR} = vec4(${colorAttribVarName}, ${getUniformCodeName(uniforms, GPS.UNIFORM_OPACITY)});`);
                    } else {
                        lines.push(`  ${GPS.VARYING_COLOR} = vec4(${colorAttribVarName}, 1.0);`);
                    }
                    break;
                }
                default: {
                    throw new Error("Unexpected type for color attribute: " + attributes[GPS.ATTRIBUTE_COLOR].glslType);
                }
            }
        } else if (uniforms[GPS.UNIFORM_COLOR]) {
            const colorUniformVarName = getUniformCodeName(uniforms, GPS.UNIFORM_COLOR);
            switch (uniforms[GPS.UNIFORM_COLOR].glslType) {
                case "vec4": {
                    lines.push("  vColor = " + colorUniformVarName + SEMICOLON);
                    break;
                }
                case "vec3": {
                    if (uniforms[GPS.UNIFORM_OPACITY]) {
                        lines.push(`  ${GPS.VARYING_COLOR} = vec4(${colorUniformVarName}, ${getUniformCodeName(uniforms, GPS.UNIFORM_OPACITY)});`);
                    } else {
                        lines.push(`  ${GPS.VARYING_COLOR} = vec4(${colorUniformVarName}, 1.0);`);
                    }
                    break;
                }
                default: {
                    throw new Error("Unexpected type for color uniform: " + uniforms[GPS.UNIFORM_COLOR].glslType);
                }
            }
        } else {
            lines.push(`  ${GPS.VARYING_COLOR} = vec4(1.0, 1.0, 1.0, 1.0);`);
        }
    }

    if (vCoords) {
        lines.push(`  ${GPS.VARYING_COORDS} = ${GPS.ATTRIBUTE_COORDS};`);
    }

    if (vLight) {
        if (uniforms[GPS.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && uniforms[GPS.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] && uniforms[GPS.UNIFORM_NORMAL_MATRIX] && attributes[GPS.ATTRIBUTE_NORMAL]) {
            lines.push("  vec3 L = normalize(" + getUniformCodeName(uniforms, GPS.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION) + ");");
            lines.push("  vec3 N = normalize(" + getUniformCodeName(uniforms, GPS.UNIFORM_NORMAL_MATRIX) + " * " + getAttribVarName(attributes[GPS.ATTRIBUTE_NORMAL], GPS.ATTRIBUTE_NORMAL) + ");");
            lines.push("  // The minus sign arises because L is the light direction, so we need dot(N, -L) = -dot(N, L)");
            lines.push("  float " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " = max(-dot(N, L), 0.0);");
            if (uniforms[GPS.UNIFORM_AMBIENT_LIGHT]) {
                lines.push(`  ${GPS.VARYING_LIGHT} = ` + getUniformCodeName(uniforms, GPS.UNIFORM_AMBIENT_LIGHT) + " + " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + getUniformCodeName(uniforms, GPS.UNIFORM_DIRECTIONAL_LIGHT_COLOR) + ";");
            } else {
                lines.push(`  ${GPS.VARYING_LIGHT} = ` + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + getUniformCodeName(uniforms, GPS.UNIFORM_DIRECTIONAL_LIGHT_COLOR) + ";");
            }
        } else {
            if (uniforms[GPS.UNIFORM_AMBIENT_LIGHT]) {
                lines.push(`  ${GPS.VARYING_LIGHT} = ` + getUniformCodeName(uniforms, GPS.UNIFORM_AMBIENT_LIGHT) + ";");
            } else {
                lines.push(`  ${GPS.VARYING_LIGHT} = vec3(1.0, 1.0, 1.0);`);
            }
        }
    }
    lines.push("}");
    lines.push("");

    const code = lines.join("\n");
    return code;
}
