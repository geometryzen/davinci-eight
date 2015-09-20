import Shareable = require('../utils/Shareable');
import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');

class SineWaveUniform extends Shareable implements UniformData {
  public amplitude: number = 1;
  public omega: number;
  public mean: number = 0;
  public uName: string;
  constructor(omega, uName = 'uSineWave') {
    super('SineWaveUniform');
    this.omega = omega;
    this.uName = uName;
  }
  setUniforms(visitor: UniformDataVisitor, canvasId): void {
    let time = Date.now() / 1000;
    let theta = this.omega * time;
    let a = this.amplitude * Math.sin(theta) + this.mean;
    // FIXME: canvasId
    visitor.uniform1f(this.uName, a, canvasId);
  }
}

export = SineWaveUniform;