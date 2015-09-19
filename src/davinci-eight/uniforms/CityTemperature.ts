import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');

/**
 * Poller for the yadda server.
 */
class CityTemperature implements UniformData {
  public temperature: number;
  private _uName;
  constructor(uName: string) {
    this.temperature = Math.E;
    this._uName = uName;
  }
  accept(visitor: UniformDataVisitor): void {
    visitor.uniform1f(this._uName, this.temperature);
  }
}

export = CityTemperature;