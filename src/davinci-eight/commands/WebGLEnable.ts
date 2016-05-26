import Capability from '../commands/Capability';
import glCapability from '../commands/glCapability';
import {ContextConsumer} from '../core/ContextConsumer';
import ContextProvider from '../core/ContextProvider';
import mustBeNumber from '../checks/mustBeNumber';
import {ShareableBase} from '../core/ShareableBase';

/**
 * <p>
 * enable(capability: Capability): void
 * <p> 
 * @class WebGLEnable
 * @extends ShareableBase
 * @implements ContextConsumer
 */
export default class WebGLEnable extends ShareableBase implements ContextConsumer {
  private _capability: Capability;

  /**
   * @class WebGLEnable
   * @constructor
   * @param capability {Capability} The capability to be enabled.
   */
  constructor(capability: Capability) {
    super()
    this.setLoggingName('WebGLEnable')
    this._capability = mustBeNumber('capability', capability)
  }

  /**
   * @method destructor
   * @param levelUp {number}
   * @return {void}
   * @protected
   */
  protected destructor(levelUp: number): void {
    this._capability = void 0
    super.destructor(levelUp + 1)
  }

  contextFree(manager: ContextProvider): void {
    // do nothing
  }

  contextGain(manager: ContextProvider): void {
    manager.gl.enable(glCapability(this._capability, manager.gl))
  }

  contextLost(): void {
    // do nothing
  }
}
