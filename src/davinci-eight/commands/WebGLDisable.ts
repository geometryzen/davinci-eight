import Capability = require('../commands/Capability')
import glCapability = require('../commands/glCapability')
import IContextConsumer = require('../core/IContextConsumer');
import IContextProvider = require('../core/IContextProvider');
import IContextCommand = require('../core/IContextCommand');
import mustBeNumber = require('../checks/mustBeNumber');
import mustBeString = require('../checks/mustBeString');
import Shareable = require('../utils/Shareable');

/**
 * <p>
 * disable(capability: Capability): void
 * <p> 
 * @class WebGLDisable
 * @extends Shareable
 * @implements IContextCommand
 * @implements IContextConsumer
 */
class WebGLDisable extends Shareable implements IContextCommand, IContextConsumer {
    private _capability: Capability;
    /**
     * @class WebGLDisable
     * @constructor
     * @param capability {string} The name of the WebGLRenderingContext property to be disabled.
     */
    constructor(capability: Capability) {
        super('WebGLDisable')
        this._capability = mustBeNumber('capability', capability)
    }

    /**
     * @method contextFree
     * @param [canvasId] {number}
     * @return {void}
     */
    contextFree(canvasId?: number): void {
        // do nothing
    }

    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void {
        manager.gl.disable(glCapability(this._capability, manager.gl))
    }

    /**
     * @method contextLost
     * @param [canvasId] {number}
     * @return {void}
     */
    contextLost(canvasId?: number): void {
        // do nothing
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this._capability = void 0
        super.destructor()
    }
}

export = WebGLDisable