import IResource from '../core/IResource';

/**
 * @interface ITexture
 */
interface ITexture extends IResource {
    bind(): void;
    unbind(): void;
}

export default ITexture;