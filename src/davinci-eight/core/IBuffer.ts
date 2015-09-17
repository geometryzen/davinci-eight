import IResource = require('../core/IResource');

/**
 * @interface IBuffer
 */
interface IBuffer extends IResource {
  bind(): void;
  unbind(): void;
}

export = IBuffer;