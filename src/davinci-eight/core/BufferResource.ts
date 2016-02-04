import IBuffer from '../core/IBuffer';
import IContextProvider from '../core/IContextProvider';
import isDefined from '../checks/isDefined';
import mustBeBoolean from '../checks/mustBeBoolean';
import mustBeObject from '../checks/mustBeObject';
import Shareable from '../utils/Shareable';

/**
 * Name used for reference count monitoring and logging.
 */
let CLASS_NAME = 'BufferResource'

/**
 * @class BufferResource
 * @extends Shareable
 */
export default class BufferResource extends Shareable implements IBuffer {
    private _buffer: WebGLBuffer;
    private manager: IContextProvider;
    private _isElements: boolean;
    /**
     * @class BufferResource
     * @constructor
     * @param manager {IContextProvider}
     * @param isElements {boolean}
     */
    constructor(manager: IContextProvider, isElements: boolean) {
        super(CLASS_NAME)
        this.manager = mustBeObject('manager', manager)
        this._isElements = mustBeBoolean('isElements', isElements)
        manager.addContextListener(this)
        manager.synchronize(this)
    }
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this.contextFree(this.manager.canvasId)
        this.manager.removeContextListener(this)
        this.manager = void 0
        this._isElements = void 0
        super.destructor();
    }

    /**
     * @method contextFree
     * @param canvasId {number}
     * @return {void}
     */
    contextFree(canvasId: number): void {
        if (this._buffer) {
            var gl = this.manager.gl
            if (isDefined(gl)) {
                gl.deleteBuffer(this._buffer)
            }
            else {
                console.error(CLASS_NAME + " must leak WebGLBuffer because WebGLRenderingContext is " + typeof gl)
            }
            this._buffer = void 0
        }
        else {
            // It's a duplicate, ignore.
        }
    }

    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void {
        if (this.manager.canvasId === manager.canvasId) {
            if (!this._buffer) {
                this._buffer = manager.gl.createBuffer()
            }
            else {
                // It's a duplicate, ignore the call.
            }
        }
        else {
            console.warn("BufferResource ignoring contextGain for canvasId " + manager.canvasId);
        }
    }

    /**
     * @method contextLost
     * @return {void}
     */
    contextLost(): void {
        this._buffer = void 0
    }

    /**
     * @method bind
     * @return {void}
     */
    bind(): void {
        let gl = this.manager.gl
        if (gl) {
            let target = this._isElements ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER
            gl.bindBuffer(target, this._buffer)
        }
        else {
            console.warn(CLASS_NAME + " bind() missing WebGL rendering context.")
        }
    }

    /**
     * @method unbind
     * @return {void}
     */
    unbind() {
        let gl = this.manager.gl
        if (gl) {
            let target = this._isElements ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER
            gl.bindBuffer(target, null)
        }
        else {
            console.warn(CLASS_NAME + " unbind() missing WebGL rendering context.")
        }

    }
}
