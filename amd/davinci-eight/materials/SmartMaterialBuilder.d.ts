import ContextMonitor = require('../core/ContextMonitor');
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
     * @param elements {Geometry} Optional.
     */
    constructor(elements?: GeometryElements);
    attribute(key: string, size: number, name?: string): SmartMaterialBuilder;
    uniform(key: string, type: string, name?: string): SmartMaterialBuilder;
    build(contexts: ContextMonitor[]): Material;
}
export = SmartMaterialBuilder;
