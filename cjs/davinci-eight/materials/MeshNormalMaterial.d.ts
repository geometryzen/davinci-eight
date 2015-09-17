import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import Material = require('../materials/Material');
/**
 * @module EIGHT
 * @class MeshNormalMaterial
 * @extends Material
 */
declare class MeshNormalMaterial extends Material {
    constructor(contexts: ContextMonitor[]);
    contextGain(manager: ContextManager): void;
}
export = MeshNormalMaterial;
