import IContextMonitor = require('../core/IContextMonitor');
import GeometryElements = require('../geometries/GeometryElements');
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
     * @param elements [GeometryElements]
     */
    constructor(elements?: GeometryElements);
    /**
     * Declares that the material should have an `attribute` with the specified name and size.
     * @method attribute
     * @param name {string}
     * @param size {number}
     */
    attribute(name: string, size: number): SmartMaterialBuilder;
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
