import { mustBeDefined } from "../checks/mustBeDefined";
import { mustBeInteger } from "../checks/mustBeInteger";
import { mustBeString } from "../checks/mustBeString";
import { AttributeGlslType } from "../core/AttributeGlslType";
import { AttributeSizeType } from "../core/AttributeSizeType";
import { getAttribVarName } from "../core/getAttribVarName";
import { Primitive } from "../core/Primitive";
import { UniformGlslType } from "../core/UniformGlslType";
import { fragmentShaderSrc } from "./fragmentShaderSrc";
import { glslAttribType } from "./glslAttribType";
import { GLSLESVersion } from "./glslVersion";
import { vColorRequired } from "./vColorRequired";
import { vCoordsRequired } from "./vCoordsRequired";
import { vertexShaderSrc } from "./vertexShaderSrc";
import { vLightRequired } from "./vLightRequired";

/**
 * @hidden
 */
function computeAttribParams(values: { [key: string]: { size: AttributeSizeType; name?: string } }) {
    const result: { [key: string]: { glslType: AttributeGlslType; name?: string } } = {};
    const keys = Object.keys(values);
    const keysLength = keys.length;
    for (let i = 0; i < keysLength; i++) {
        const key = keys[i];
        const attribute = values[key];
        mustBeInteger("size", attribute.size);
        const varName = getAttribVarName(attribute, key);
        result[varName] = { glslType: glslAttribType(key, attribute.size) };
    }
    return result;
}

/**
 * GraphicsProgramBuilder is the builder pattern for generating vertex and fragment shader source code.
 * @hidden
 */
export class GraphicsProgramBuilder {
    private aMeta: { [key: string]: { size: AttributeSizeType } } = {};

    private uParams: { [key: string]: { glslType: UniformGlslType; name?: string } } = {};

    private _version: GLSLESVersion = GLSLESVersion.OneHundred;

    /**
     * @param primitive
     */
    constructor(primitive?: Primitive) {
        if (primitive) {
            const attributes = primitive.attributes;
            const keys = Object.keys(attributes);
            for (let i = 0, iLength = keys.length; i < iLength; i++) {
                const key = keys[i];
                const attribute = attributes[key];
                this.attribute(key, attribute.size);
            }
        }
    }

    public attribute(name: string, size: AttributeSizeType): this {
        mustBeString("name", name);
        mustBeInteger("size", size);
        this.aMeta[name] = { size };
        return this;
    }

    public uniform(name: string, glslType: UniformGlslType): this {
        mustBeString("name", name);
        mustBeString("glslType", glslType);
        this.uParams[name] = { glslType };
        return this;
    }

    public version(version: GLSLESVersion): this {
        mustBeDefined("version", version);
        this._version = version;
        return this;
    }

    /**
     * Computes vertex shader source code consistent with the state of this builder.
     */
    public vertexShaderSrc(): string {
        const aParams = computeAttribParams(this.aMeta);
        const vColor = vColorRequired(aParams, this.uParams);
        const vCoords = vCoordsRequired(aParams, this.uParams);
        const vLight = vLightRequired(aParams, this.uParams);
        return vertexShaderSrc(aParams, this.uParams, vColor, vCoords, vLight, this._version);
    }

    /**
     * Computes fragment shader source code consistent with the state of this builder.
     */
    public fragmentShaderSrc(): string {
        const aParams = computeAttribParams(this.aMeta);
        const vColor = vColorRequired(aParams, this.uParams);
        const vCoords = vCoordsRequired(aParams, this.uParams);
        const vLight = vLightRequired(aParams, this.uParams);
        return fragmentShaderSrc(aParams, this.uParams, vColor, vCoords, vLight, this._version);
    }
}
