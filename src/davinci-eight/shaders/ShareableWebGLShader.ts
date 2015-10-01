import IContextProvider = require('../core/IContextProvider');
import IContextMonitor = require('../core/IContextMonitor');
import IShader = require('../shaders/IShader');
import Shareable = require('../utils/Shareable')

class ShareableWebGLShader extends Shareable implements IShader {
  private shader: WebGLShader;
  /**
   * Construction on a single monitor says that this will only be used with one.
   * But what if someone external calls monitor.addContextListener(shader)?
   * Then the shader starts receiving events for that monitor.
   * This means that this resource is inherantly multi-canvas.
   * It also means that the argument in the constructor is bogus because it is not fixed.
   * It's just an initial list.
   * But then we need IContextProvider to extend IContextMonitor so that this can unhook?
   */
  constructor(monitor: IContextMonitor) {
    super('WebGLShader');
    monitor.addContextListener(this);
  }
  destructor(): void {
  }
  contextFree(canvasId: number): void {

  }
  contextGain(manager: IContextProvider): void {
    
  }
  contextLost(canvasId: number): void {
    
  }
}

export = ShareableWebGLShader;