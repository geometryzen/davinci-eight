import getAttribVarName from '../core/getAttribVarName';
import glslAttribType from './glslAttribType';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeString from '../checks/mustBeString';
import Primitive from '../core/Primitive';
import SmartGraphicsProgram from '../materials/SmartGraphicsProgram';
import vColorRequired from './vColorRequired';
import vLightRequired from './vLightRequired';
import fragmentShaderSrc from './fragmentShaderSrc';
import vertexShaderSrc from './vertexShaderSrc';

function computeAttribParams(values: { [key: string]: { size: number, name?: string } }) {
    const result: { [key: string]: { glslType: string, name?: string } } = {}
    const keys = Object.keys(values)
    const keysLength = keys.length
    for (let i = 0; i < keysLength; i++) {
        const key = keys[i]
        const attribute = values[key]
        const size = mustBeInteger('size', attribute.size)
        const varName = getAttribVarName(attribute, key)
        result[varName] = { glslType: glslAttribType(key, size) }
    }
    return result
}

export default class GraphicsProgramBuilder {

    private aMeta: { [key: string]: { size: number; } } = {};

    private uParams: { [key: string]: { glslType: string; name?: string } } = {};

    constructor(primitive?: Primitive) {
        if (primitive) {
            const attributes = primitive.attributes
            const keys = Object.keys(attributes)
            for (let i = 0, iLength = keys.length; i < iLength; i++) {
                const key = keys[i]
                const attribute = attributes[key]
                this.attribute(key, attribute.size)
            }
        }
    }

    public attribute(name: string, size: number): GraphicsProgramBuilder {
        mustBeString('name', name)
        mustBeInteger('size', size)
        this.aMeta[name] = { size: size }
        return this
    }

    public uniform(name: string, type: string): GraphicsProgramBuilder {
        mustBeString('name', name)
        mustBeString('type', type)
        this.uParams[name] = { glslType: type }
        return this
    }

    public build(): SmartGraphicsProgram {
        // FIXME: Push this calculation down into the functions.
        // Then the data structures are based on size.
        // uniforms based on numeric type?
        const aParams = computeAttribParams(this.aMeta)
        const vColor = vColorRequired(aParams, this.uParams)
        const vLight = vLightRequired(aParams, this.uParams)
        return new SmartGraphicsProgram(aParams, this.uParams, vColor, vLight)
    }

    public vertexShaderSrc(): string {
        const aParams = computeAttribParams(this.aMeta)
        const vColor = vColorRequired(aParams, this.uParams)
        const vLight = vLightRequired(aParams, this.uParams)
        return vertexShaderSrc(aParams, this.uParams, vColor, vLight)
    }

    public fragmentShaderSrc(): string {
        const aParams = computeAttribParams(this.aMeta)
        const vColor = vColorRequired(aParams, this.uParams)
        const vLight = vLightRequired(aParams, this.uParams)
        return fragmentShaderSrc(aParams, this.uParams, vColor, vLight)
    }
}
