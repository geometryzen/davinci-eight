import IContextProvider from '../core/IContextProvider';
import IContextMonitor from '../core/IContextMonitor';
import IShader from '../shaders/IShader';
import Shareable from '../utils/Shareable';

/**
 * Under Construction
 * Intentionally Undocumented
 */
export default class ShareableWebGLShader extends Shareable implements IShader {
    private shader: WebGLShader;
    private monitor: IContextMonitor;
    constructor(monitor: IContextMonitor) {
        super('WebGLShader')
        this.monitor = monitor
        monitor.addRef()
        monitor.addContextListener(this)
    }
    destructor(): void {
        this.monitor.removeContextListener(this)
        this.monitor.release()
        this.monitor = void 0
        super.destructor()
    }
    contextFree(manager: IContextProvider): void {

    }
    contextGain(manager: IContextProvider): void {

    }
    contextLost(canvasId: number): void {

    }
}
