import Capability from '../commands/Capability';
import glCapability from '../commands/glCapability';
import IContextConsumer from '../core/IContextConsumer';
import IContextProvider from '../core/IContextProvider';
import mustBeNumber from '../checks/mustBeNumber';
import Shareable from '../core/Shareable';

/**
 * <p>
 * disable(capability: Capability): void
 * <p> 
 * @class WebGLDisable
 * @extends Shareable
 * @implements IContextConsumer
 */
export default class WebGLDisable extends Shareable implements IContextConsumer {
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

    contextFree(manager: IContextProvider): void {
        // do nothing
    }

    contextGain(manager: IContextProvider): void {
        manager.gl.disable(glCapability(this._capability, manager.gl))
    }

    contextLost(): void {
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
