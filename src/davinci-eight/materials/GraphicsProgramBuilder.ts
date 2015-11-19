import IContextMonitor = require('../core/IContextMonitor');
import getAttribVarName = require('../core/getAttribVarName');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import getUniformVarName = require('../core/getUniformVarName');
import glslAttribType = require('../programs/glslAttribType');
import GraphicsProgram = require('../materials/GraphicsProgram');
import mustBeInteger = require('../checks/mustBeInteger');
import mustBeString = require('../checks/mustBeString');
import SmartGraphicsProgram = require('../materials/SmartGraphicsProgram');
import UniformMetaInfo = require('../core/UniformMetaInfo');
import vColorRequired = require('../programs/vColorRequired');
import vLightRequired = require('../programs/vLightRequired');

function computeAttribParams(values: { [key: string]: { chunkSize: number, name?: string } }) {
    var result: { [key: string]: { glslType: string, name?: string } } = {}
    let keys = Object.keys(values);
    let keysLength = keys.length;
    for (var i = 0; i < keysLength; i++) {
        let key = keys[i];
        let attribute = values[key];
        let chunkSize = mustBeInteger('chunkSize', attribute.chunkSize);
        let varName = getAttribVarName(attribute, key);
        result[varName] = { glslType: glslAttribType(key, chunkSize) };
    }
    return result;
}

function updateUniformMeta(uniforms: { [key: string]: UniformMetaInfo }[]) {
    uniforms.forEach(function(values) {
        let keys = Object.keys(values);
        let keysLength = keys.length;
        for (var i = 0; i < keysLength; i++) {
            let key = keys[i];
            let uniform = values[key];
            let varName = getUniformVarName(uniform, key);
            this.uParams[varName] = { glslType: uniform.glslType };
        }
    });
}

/**
 * @class GraphicsProgramBuilder
 */
class GraphicsProgramBuilder {

    /**
     * @property aMeta
     * @private
     */
    private aMeta: { [key: string]: { chunkSize: number; } } = {};

    /**
     * @property uParams
     * @private
     */
    private uParams: { [key: string]: { glslType: string; name?: string } } = {};

    /**
     * @class GraphicsProgramBuilder
     * @constructor
     * @param primitive [DrawPrimitive]
     */
    constructor(primitive?: DrawPrimitive) {
        if (primitive) {
            let attributes = primitive.attributes
            let keys = Object.keys(attributes)
            for (var i = 0, iLength = keys.length; i < iLength; i++) {
                let key = keys[i]
                let attribute = attributes[key]
                this.attribute(key, attribute.chunkSize)
            }
        }
    }

    /**
     * Declares that the material should have an `attribute` with the specified name and chunkSize.
     * @method attribute
     * @param name {string}
     * @param chunkSize {number}
     * @return {GraphicsProgramBuilder}
     * @chainable
     */
    public attribute(name: string, chunkSize: number): GraphicsProgramBuilder {
        mustBeString('name', name)
        mustBeInteger('chunkSize', chunkSize)

        this.aMeta[name] = { chunkSize: chunkSize }
        return this
    }

    /**
     * Declares that the material should have a `uniform` with the specified name and type.
     * @method uniform
     * @param name {string}
     * @param type {string} The GLSL type. e.g. 'float', 'vec3', 'mat2'
     * @return {GraphicsProgramBuilder}
     * @chainable
     */
    public uniform(name: string, type: string): GraphicsProgramBuilder {
        mustBeString('name', name)
        mustBeString('type', type)  // Must also be a valid GLSL type.

        this.uParams[name] = { glslType: type }
        return this
    }

    /**
     * @method build
     * @param contexts {IContextMonitor[]}
     * @return {GraphicsProgram}
     */
    public build(contexts: IContextMonitor[]): GraphicsProgram {
        // FIXME: Push this calculation down into the functions.
        // Then the data structures are based on chunkSize.
        // uniforms based on numeric type?
        let aParams = computeAttribParams(this.aMeta)
        let vColor = vColorRequired(aParams, this.uParams)
        let vLight = vLightRequired(aParams, this.uParams)
        return new SmartGraphicsProgram(contexts, aParams, this.uParams, vColor, vLight)
    }
}

export = GraphicsProgramBuilder;