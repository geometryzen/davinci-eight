import ContextMonitor = require('../core/ContextMonitor');
import IMaterial = require('../core/IMaterial');
import MeshMaterialParameters = require('../materials/MeshMaterialParameters');
import Material = require('../materials/Material');
/**
 * @class MeshMaterial
 * @extends Material
 */
declare class MeshMaterial extends Material {
    /**
     * @class MeshMaterial
     * @constructor
     * @param monitors [ContextMonitor[]=[]]
     * @parameters [MeshNormalParameters]
     */
    constructor(monitors?: ContextMonitor[], parameters?: MeshMaterialParameters);
    protected createProgram(): IMaterial;
}
export = MeshMaterial;
