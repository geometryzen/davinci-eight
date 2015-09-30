import IMaterial = require('../core/IMaterial');
import IUnknown = require('../core/IUnknown');

// FIXME: Move this to core?
/**
 * A buffer geometry is implicitly bound to a single context.
 * @class IBufferGeometry
 * @extends IUnkown
 */
interface IBufferGeometry extends IUnknown {
  /**
   * @property uuid
   * @type {string}
   */
  uuid: string;
  /**
   * @method bind
   * @param program {IMaterial}
   * @param aNameToKeyName
   * @return {void}
   */
  bind(program: IMaterial, aNameToKeyName?: {[name: string]: string}): void;
  /**
   * @method draw
   * @return {void}
   */
  draw(): void;
  /**
   * @method unbind
   * @return {void}
   */
  unbind(): void;
}

export = IBufferGeometry;