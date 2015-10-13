import IContextMonitor = require('../core/IContextMonitor');
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
     * @param monitors [IContextMonitor[]=[]]
     * @parameters [MeshNormalParameters]
     */
    constructor(monitors?: IContextMonitor[], parameters?: MeshMaterialParameters);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * @method createMaterial
     * @return {IMaterial}
     * @protected
     */
    protected createMaterial(): IMaterial;
}
export = MeshMaterial;
