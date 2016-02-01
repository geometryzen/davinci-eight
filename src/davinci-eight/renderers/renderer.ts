import Capability from '../commands/Capability';
import IContextProvider from '../core/IContextProvider';
import IContextRenderer from '../renderers/IContextRenderer';
import IContextCommand from '../core/IContextCommand';
import IUnknownArray from '../collections/IUnknownArray';
import refChange from '../utils/refChange';
import uuid4 from '../utils/uuid4';
import WebGLClearColor from '../commands/WebGLClearColor';
import WebGLEnable from '../commands/WebGLEnable';
import WebGLDisable from '../commands/WebGLDisable';

const CLASS_NAME = "CanonicalIContextRenderer"

/**
 * We need to know the canvasId so that we can tell drawables where to draw.
 * However, we don't need an don't want a canvas because we can only get that once the
 * canvas has loaded. I suppose a promise would be OK, but that's for another day.
 *
 * Part of the role of this class is to manage the commands that are executed at startup/prolog.
 */
export default function renderer(): IContextRenderer {
    let _manager: IContextProvider;
    const uuid = uuid4().generate()
    let refCount = 1
    let commands = new IUnknownArray<IContextCommand>([])

    const self: IContextRenderer = {
        addRef(): number {
            refCount++
            refChange(uuid, CLASS_NAME, +1)
            return refCount
        },
        get canvas(): HTMLCanvasElement {
            return _manager ? _manager.canvas : void 0
        },
        get commands(): IUnknownArray<IContextCommand> {
            return commands;
        },
        get gl(): WebGLRenderingContext {
            return _manager ? _manager.gl : void 0
        },
        clearColor(red: number, green: number, blue: number, alpha: number): void {
            commands.pushWeakRef(new WebGLClearColor(red, green, blue, alpha))
        },
        contextFree(canvasId?: number) {
            commands.forEach(function(command: IContextCommand) {
                command.contextFree(canvasId)
            })
            _manager = void 0;
        },
        contextGain(manager: IContextProvider) {
            // This object is single context, so we only ever get called with one manager at a time (serially).
            _manager = manager;
            commands.forEach(function(command: IContextCommand) {
                command.contextGain(manager)
            })
        },
        contextLost(canvasId?: number) {
            commands.forEach(function(command: IContextCommand) {
                command.contextLost(canvasId)
            })
            _manager = void 0;
        },
        disable(capability: Capability): void {
            commands.pushWeakRef(new WebGLDisable(capability))
        },
        enable(capability: Capability): void {
            commands.pushWeakRef(new WebGLEnable(capability))
        },
        viewport(x: number, y: number, width: number, height: number): void {
            return self.gl.viewport(x, y, width, height)
        },
        release(): number {
            refCount--
            refChange(uuid, CLASS_NAME, -1)
            if (refCount === 0) {
                commands.release()
                commands = void 0
                return 0
            }
            else {
                return refCount
            }
        }
    }
    refChange(uuid, CLASS_NAME, +1)
    return self
}
