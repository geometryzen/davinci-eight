import ContextMonitor = require('../core/ContextMonitor');
import IMaterial = require('../core/IMaterial');
import LineMaterialParameters = require('../materials/LineMaterialParameters');
import Material = require('../materials/Material');
/**
 * @class PointMaterial
 * @extends Material
 */
declare class PointMaterial extends Material {
    /**
     * @class PointMaterial
     * @constructor
     * @param monitors [ContextMonitor[]=[]]
     * @parameters [MeshNormalParameters]
     */
    constructor(monitors?: ContextMonitor[], parameters?: LineMaterialParameters);
    protected createProgram(): IMaterial;
}
export = PointMaterial;
