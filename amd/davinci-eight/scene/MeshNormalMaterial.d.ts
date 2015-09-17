import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import Material = require('../scene/Material');
/**
 * @module EIGHT
 * @class MeshNormalMaterial
 * @extends Material
 */
declare class MeshNormalMaterial extends Material {
    constructor(monitors: ContextMonitor[]);
    contextGain(manager: ContextManager): void;
}
export = MeshNormalMaterial;
