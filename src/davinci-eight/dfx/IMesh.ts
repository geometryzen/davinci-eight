import IProgram = require('../core/IProgram');
import IUnknown = require('../core/IUnknown');

// TODO: IMesh to extend IResource allowing for context loss recovery?
// FIXME: Move this to core?
// FIXME: Documentation

/**
 * @interface IMesh
 */
interface IMesh extends IUnknown {
  /**
   * @property uuid
   */
  uuid: string;
  /**
   * @method bind
   * @param program {IProgram}
   * @param aNameToKeyName
   */
  bind(program: IProgram, aNameToKeyName?: {[name: string]: string}): void;
  /**
   * @method draw
   *
   * An abstraction of either drawElements or drawArrays, as appropriate.
   */
  draw(): void;
  /**
   *
   */
  unbind(): void;
}

export = IMesh;