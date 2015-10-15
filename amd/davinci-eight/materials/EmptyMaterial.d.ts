import IContextMonitor = require('../core/IContextMonitor');
import IMaterial = require('../core/IMaterial');
import LineMaterialParameters = require('../materials/LineMaterialParameters');
import Material = require('../materials/Material');
/**
 * @class EmptyMaterial
 * @extends Material
 */
declare class EmptyMaterial extends Material {
    /**
     * This will be used when rendering empty simplices!
     * @class EmptyMaterial
     * @constructor
     * @param monitors [IContextMonitor[]=[]]
     * @parameters [MeshNormalParameters]
     */
    constructor(monitors?: IContextMonitor[], parameters?: LineMaterialParameters);
    protected createMaterial(): IMaterial;
}
export = EmptyMaterial;
