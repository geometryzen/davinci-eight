import ContextProvider from './ContextProvider';
import DrawMode from './DrawMode';
import drawModeToGL from './drawModeToGL'
import readOnly from '../i18n/readOnly';
import ShareableBase from './ShareableBase';
import Engine from './Engine';

/**
 * Intentionally undocumented.
 */
export default class DefaultContextProvider extends ShareableBase implements ContextProvider {

  private _renderer: Engine

  constructor(renderer: Engine) {
    super('DefaultContextProvider')
    this._renderer = renderer
  }

  protected destructor(): void {
    super.destructor()
  }

  get gl() {
    return this._renderer.gl
  }
  set gl(unused) {
    throw new Error(readOnly('gl').message)
  }

  disableVertexAttribArray(index: number): void {
    const gl = this._renderer.gl
    gl.disableVertexAttribArray(index)
  }

  drawElements(mode: number, count: number, offset: number): void {
    const gl = this._renderer.gl
    gl.drawElements(mode, count, gl.UNSIGNED_SHORT, offset)
  }

  drawModeToGL(drawMode: DrawMode): number {
    return drawModeToGL(drawMode, this._renderer.gl)
  }

  enableVertexAttribArray(index: number): void {
    const gl = this._renderer.gl
    gl.enableVertexAttribArray(index)
  }

  vertexAttribPointer(index: number, size: number, normalized: boolean, stride: number, offset: number): void {
    const gl = this._renderer.gl
    gl.vertexAttribPointer(index, size, gl.FLOAT, normalized, stride, offset)
  }
}
