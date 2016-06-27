import ContextProvider from '../core/ContextProvider';
import DrawMode from '../core/DrawMode';
import drawModeToGL from '../core/drawModeToGL';
import mustBeInteger from '../checks/mustBeInteger';
import readOnly from '../i18n/readOnly';
import {ShareableBase} from '../core/ShareableBase';
import {Engine} from '../core/Engine';

/**
 * Intentionally undocumented.
 */
export default class DefaultContextProvider extends ShareableBase implements ContextProvider {

    private engine: Engine

    constructor(engine: Engine) {
        super()
        this.setLoggingName('DefaultContextProvider')
        // We don't reference count the engine in order to avoid creating a loop.
        // Our lifetime is controlled by the Engine itself.
        this.engine = engine
    }

    protected destructor(levelUp: number): void {
        this.engine = void 0
        super.destructor(levelUp + 1)
    }

    get gl() {
        if (this.engine) {
            return this.engine.gl
        }
        else {
            throw new Error(`${this._type}.engine is undefined.`)
        }
    }
    set gl(unused) {
        throw new Error(readOnly('gl').message)
    }

    disableVertexAttribArray(index: number): void {
        const gl = this.gl;
        if (gl) {
            gl.disableVertexAttribArray(index);
        }
    }

    drawArrays(mode: number, first: number, count: number): void {
        const gl = this.gl
        gl.drawArrays(mode, first, count)
    }

    drawElements(mode: number, count: number, offset: number): void {
        const gl = this.gl
        gl.drawElements(mode, count, gl.UNSIGNED_SHORT, offset)
    }

    drawModeToGL(drawMode: DrawMode): number {
        return drawModeToGL(drawMode, this.gl)
    }

    enableVertexAttribArray(index: number): void {
        const gl = this.gl
        gl.enableVertexAttribArray(index)
    }

    isContextLost(): boolean {
        const gl = this.gl
        if (gl) {
            return gl.isContextLost()
        }
        else {
            throw new Error("WebGLRenderingContext is undefined.")
        }
    }

    vertexAttribPointer(index: number, size: number, normalized: boolean, stride: number, offset: number): void {
        const gl = this.gl
        gl.vertexAttribPointer(index, size, gl.FLOAT, normalized, stride, offset)
    }
}
