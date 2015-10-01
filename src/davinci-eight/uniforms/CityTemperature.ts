import IFacet = require('../core/IFacet');
import IFacetVisitor = require('../core/IFacetVisitor');
import Shareable = require('../utils/Shareable');
/**
 * Poller for the ...? server.
 */
class CityTemperature extends Shareable implements IFacet {
  public temperature: number;
  private _uName;
  constructor(uName: string) {
    super('CityTemperature')
    this.temperature = Math.E;
    this._uName = uName;
  }
  setUniforms(visitor: IFacetVisitor, canvasId): void {
    visitor.uniform1f(this._uName, this.temperature, canvasId);
  }
}

export = CityTemperature;