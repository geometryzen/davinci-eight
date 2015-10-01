import IContextMonitor = require('../core/IContextMonitor');
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
     * @param monitors [IContextMonitor[]=[]]
     * @parameters [MeshNormalParameters]
     */
    constructor(monitors?: IContextMonitor[], parameters?: LineMaterialParameters);
    protected createProgram(): IMaterial;
}
export = LineMaterial;
