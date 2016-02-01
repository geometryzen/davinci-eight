import Capability from '../commands/Capability';
import glCapability from '../commands/glCapability';
import IContextConsumer from '../core/IContextConsumer';
import IContextProvider from '../core/IContextProvider';
import IContextCommand from '../core/IContextCommand';
import mustBeNumber from '../checks/mustBeNumber';
import Shareable from '../utils/Shareable';

/**
 * <p>
 * enable(capability: Capability): void
 * <p> 
 * @class WebGLEnable
 * @extends Shareable
 * @implements IContextCommand
 * @implements IContextConsumer
 */
export default class WebGLEnable extends Shareable implements IContextCommand, IContextConsumer {
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
        manager.gl.enable(glCapability(this._capability, manager.gl))
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
