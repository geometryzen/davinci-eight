import IContextProvider = require('../core/IContextProvider');
import IContextMonitor = require('../core/IContextMonitor');
import IMaterial = require('../core/IMaterial');
import LineMaterialParameters = require('../materials/LineMaterialParameters');
import Material = require('../materials/Material');
import MonitorList = require('../scene/MonitorList');
import createMaterial = require('../programs/createMaterial');
import SmartMaterialBuilder = require('../materials/SmartMaterialBuilder')
import Symbolic = require('../core/Symbolic')
/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME = 'EmptyMaterial';

function nameBuilder(): string {
    return LOGGING_NAME;
}

/**
 * @class EmptyMaterial
 * @extends Material
 */
class EmptyMaterial extends Material {
    /**
     * This will be used when rendering empty simplices!
     * @class EmptyMaterial
     * @constructor
     * @param monitors [IContextMonitor[]=[]]
     * @parameters [MeshNormalParameters]
     */
    constructor(monitors: IContextMonitor[] = [], parameters?: LineMaterialParameters) {
        super(monitors, LOGGING_NAME);
    }
    protected createMaterial(): IMaterial {
        let smb = new SmartMaterialBuilder();

        smb.attribute(Symbolic.ATTRIBUTE_POSITION, 3);
        // smb.attribute(Symbolic.ATTRIBUTE_COLOR, 3);

        smb.uniform(Symbolic.UNIFORM_COLOR, 'vec3');
        smb.uniform(Symbolic.UNIFORM_MODEL_MATRIX, 'mat4');
        smb.uniform(Symbolic.UNIFORM_PROJECTION_MATRIX, 'mat4');
        smb.uniform(Symbolic.UNIFORM_VIEW_MATRIX, 'mat4');
        smb.uniform(Symbolic.UNIFORM_POINT_SIZE, 'float');

        return smb.build(this.monitors);
    }
}

export = EmptyMaterial;
