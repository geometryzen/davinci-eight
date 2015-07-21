import DrawContext = require('../core/DrawContext');
/**
 * TODO: Undecided as to whether this should be used.
 */
class FrameworkDrawContext implements DrawContext {
  private startTime: number;
  private frameTime: number;
  constructor() {
    this.startTime = Date.now();
    this.frameTime = 0;
  }
  time(): number {
    return this.frameTime;
  }
  frameBegin(): void {
  }
  frameEnd(): void {
    this.frameTime = Date.now() - this.startTime
  }
}

export = FrameworkDrawContext;
