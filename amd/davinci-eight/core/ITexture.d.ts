import IResource = require('../core/IResource');
/**
 * @interface ITexture
 */
interface ITexture extends IResource {
    bind(): void;
    unbind(): void;
}
export = ITexture;
