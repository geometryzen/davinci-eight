import ContextMonitor = require('../core/ContextMonitor');
import Geometry = require('../geometries/Geometry');
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
     * @param geometry {Geometry} Optional.
     */
    constructor(geometry?: Geometry);
    attribute(key: string, size: number, name?: string): SmartMaterialBuilder;
    uniform(key: string, type: string, name?: string): SmartMaterialBuilder;
    build(contexts: ContextMonitor[]): Material;
}
export = SmartMaterialBuilder;
