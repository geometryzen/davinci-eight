import IContextMonitor = require('../core/IContextMonitor');
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
     * @param monitors [IContextMonitor[]=[]]
     * @parameters [MeshNormalParameters]
     */
    constructor(monitors?: IContextMonitor[], parameters?: LineMaterialParameters);
    protected createProgram(): IMaterial;
}
export = PointMaterial;
