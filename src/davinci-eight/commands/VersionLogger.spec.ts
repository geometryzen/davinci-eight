import VersionLogger from './VersionLogger';
import refChange from '../core/refChange';

describe("VersionLogger", function () {
  it("new-release", function () {
    refChange('quiet');
    refChange('start');
    const logger = new VersionLogger();
    logger.release();
    const outstanding = refChange('stop');
    expect(outstanding).toBe(0);
  });
});
