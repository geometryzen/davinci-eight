import ContextMonitor = require('../core/ContextMonitor');
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
     */
    constructor(contexts: ContextMonitor[], parameters?: MeshNormalMaterialParameters);
}
export = MeshNormalMaterial;
