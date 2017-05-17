import { Engine } from '../core/Engine';
import { EIGHTLogger } from './EIGHTLogger';
import { refChange } from '../core/refChange';

describe("EIGHTLogger", function () {
  it("new-release", function () {
    refChange('quiet');
    refChange('reset');
    refChange('quiet');
    refChange('start');
    const engine = new Engine();
    const logger = new EIGHTLogger();
    logger.release();
    engine.release();
    refChange('quiet');
    const outstanding = refChange('stop');
    expect(outstanding).toBe(0);
    refChange('quiet');
    refChange('reset');
  });
});
