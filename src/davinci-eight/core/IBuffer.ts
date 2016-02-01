import IResource from '../core/IResource';

/**
 * @interface IBuffer
 */
interface IBuffer extends IResource {
    bind(): void;
    unbind(): void;
}

export default IBuffer;
