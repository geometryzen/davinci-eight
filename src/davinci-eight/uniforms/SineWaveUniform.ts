import Shareable = require('../utils/Shareable');
import IFacet = require('../core/IFacet');
import IFacetVisitor = require('../core/IFacetVisitor');

class SineWaveUniform extends Shareable implements IFacet {
  public amplitude: number = 1;
  public omega: number;
  public mean: number = 0;
  public uName: string;
  constructor(omega: number, uName = 'uSineWave') {
    super('SineWaveUniform');
    this.omega = omega;
    this.uName = uName;
  }
  setUniforms(visitor: IFacetVisitor, canvasId: number): void {
    let time = Date.now() / 1000;
    let theta = this.omega * time;
    let a = this.amplitude * Math.sin(theta) + this.mean;
    // FIXME: canvasId
    visitor.uniform1f(this.uName, a, canvasId);
  }
}

export = SineWaveUniform;
