import ContextMonitor = require('../core/ContextMonitor');
import IMaterial = require('../core/IMaterial');
import MeshNormalMaterialParameters = require('../materials/MeshNormalMaterialParameters');
import Material = require('../materials/Material');
/**
 * @class MeshNormalMaterial
 * @extends Material
 */
declare class MeshNormalMaterial extends Material {
    /**
     * @class MeshNormalMaterial
     * @constructor
     * @param monitors [ContextMonitor[]=[]]
     * @parameters [MeshNormalParameters]
     */
    constructor(monitors?: ContextMonitor[], parameters?: MeshNormalMaterialParameters);
    protected createProgram(): IMaterial;
}
export = MeshNormalMaterial;
