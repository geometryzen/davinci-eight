import IContextProvider from './IContextProvider';
import mustBeBoolean from '../checks/mustBeBoolean';
import mustBeObject from '../checks/mustBeObject';
import mustBeUndefined from '../checks/mustBeUndefined';
import ShareableContextListener from './ShareableContextListener';

/**
 * @module EIGHT
 * @submodule core
 * @class ShareableWebGLBuffer
 * @extends Shareable
 */
export default class ShareableWebGLBuffer extends ShareableContextListener {
    private _buffer: WebGLBuffer;
    private _isElements: boolean;

    /**
     * Cache the target when we have a context.
     * @property _target
     * @type {number}
     * @private
     */
    private _target: number;

    /**
     * @class ShareableWebGLBuffer
     * @constructor
     * @param manager {IContextProvider}
     * @param isElements {boolean}
     */
    constructor(isElements: boolean) {
        super('ShareableWebGLBuffer')
        this._isElements = mustBeBoolean('isElements', isElements)
    }
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this._isElements = void 0
        this._target = void 0
        super.destructor()
        mustBeUndefined(this._type, this._buffer)
    }

    contextFree(context: IContextProvider): void {
        mustBeObject('context', context)
        if (this._buffer) {
            const gl = context.gl
            if (gl) {
                gl.deleteBuffer(this._buffer)
            }
            else {
                console.error(`${this._type} must leak WebGLBuffer because WebGLRenderingContext is ` + typeof gl)
            }
            this._buffer = void 0
            this._target = void 0
        }
        else {
            // It's a duplicate, ignore.
        }
        super.contextFree(context)
    }

    contextGain(context: IContextProvider): void {
        mustBeObject('context', context)
        const gl = context.gl
        if (!this._buffer) {
            this._buffer = gl.createBuffer()
            this._target = this._isElements ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER
        }
        else {
            // It's a duplicate, ignore the call.
        }
        super.contextGain(context)
    }

    contextLost(): void {
        this._buffer = void 0
        this._target = void 0
        super.contextLost()
    }

    /**
     * @method bind
     * @return {void}
     */
    bind(): void {
        const gl = this.gl
        if (gl) {
            gl.bindBuffer(this._target, this._buffer)
        }
        else {
            console.warn(`${this._type}.bind() ignored because no context.`)
        }
    }

    /**
     * @method unbind
     * @return {void}
     */
    unbind() {
        const gl = this.gl
        if (gl) {
            gl.bindBuffer(this._target, null)
        }
        else {
            console.warn(`${this._type}.unbind() ignored because no context.`)
        }
    }
}
