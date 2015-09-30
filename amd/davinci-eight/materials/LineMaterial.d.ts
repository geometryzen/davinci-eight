import ContextMonitor = require('../core/ContextMonitor');
import IMaterial = require('../core/IMaterial');
import LineMaterialParameters = require('../materials/LineMaterialParameters');
import Material = require('../materials/Material');
/**
 * @class LineMaterial
 * @extends Material
 */
declare class LineMaterial extends Material {
    /**
     * @class LineMaterial
     * @constructor
     * @param monitors [ContextMonitor[]=[]]
     * @parameters [MeshNormalParameters]
     */
    constructor(monitors?: ContextMonitor[], parameters?: LineMaterialParameters);
    protected createProgram(): IMaterial;
}
export = LineMaterial;
