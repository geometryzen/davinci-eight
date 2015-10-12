import IContextMonitor = require('../core/IContextMonitor');
import IMaterial = require('../core/IMaterial');
import Material = require('../materials/Material');
/**
 * @class MeshLambertMaterial
 * @extends Material
 */
declare class MeshLambertMaterial extends Material {
    /**
     *
     * @class MeshLambertMaterial
     * @constructor
     * @param monitors [IContextMonitor[]=[]]
     */
    constructor(monitors?: IContextMonitor[]);
    protected destructor(): void;
    protected createProgram(): IMaterial;
}
export = MeshLambertMaterial;
