import IContextMonitor = require('../core/IContextMonitor');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import Material = require('../materials/Material');
/**
 * @class SmartMaterialBuilder
 */
declare class SmartMaterialBuilder {
    private aMeta;
    private uParams;
    /**
     * @class SmartMaterialBuilder
     * @constructor
     * @param primitive [DrawPrimitive]
     */
    constructor(primitive?: DrawPrimitive);
    /**
     * Declares that the material should have an `attribute` with the specified name and chunkSize.
     * @method attribute
     * @param name {string}
     * @param chunkSize {number}
     */
    attribute(name: string, chunkSize: number): SmartMaterialBuilder;
    /**
     * Declares that the material should have a `uniform` with the specified name and type.
     * @method uniform
     * @param name {string}
     * @param type {string} The GLSL type. e.g. 'float', 'vec3', 'mat2'
     */
    uniform(name: string, type: string): SmartMaterialBuilder;
    /**
     * @method build
     * @param contexts {IContextMonitor[]}
     * @return {Material}
     */
    build(contexts: IContextMonitor[]): Material;
}
export = SmartMaterialBuilder;
