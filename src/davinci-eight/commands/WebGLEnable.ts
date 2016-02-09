import Capability from '../commands/Capability';
import glCapability from '../commands/glCapability';
import IContextConsumer from '../core/IContextConsumer';
import IContextProvider from '../core/IContextProvider';
import mustBeNumber from '../checks/mustBeNumber';
import Shareable from '../core/Shareable';

/**
 * <p>
 * enable(capability: Capability): void
 * <p> 
 * @class WebGLEnable
 * @extends Shareable
 * @implements IContextConsumer
 */
export default class WebGLEnable extends Shareable implements IContextConsumer {
    private _capability: Capability;
    /**
     * @class WebGLEnable
     * @constructor
     * @param capability {Capability} The capability to be enabled.
     */
    constructor(capability: Capability) {
        super('WebGLEnable')
        this._capability = mustBeNumber('capability', capability)
    }

    contextFree(manager: IContextProvider): void {
        // do nothing
    }

    contextGain(manager: IContextProvider): void {
        manager.gl.enable(glCapability(this._capability, manager.gl))
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
