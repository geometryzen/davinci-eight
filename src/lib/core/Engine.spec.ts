import { Engine } from './Engine';
import { refChange } from './refChange';

describe("Engine", function () {
  it("should release resources", function () {
    refChange('quiet');
    refChange('reset');
    refChange('quiet');
    refChange('start');
    const engine = new Engine();
    expect(engine instanceof Engine).toBe(true);
    engine.release();
    const outstanding = refChange('dump');
    expect(outstanding).toBe(0);
    refChange('quiet');
    refChange('reset');
  });
  it("should be recyclable", function () {
    refChange('quiet');
    refChange('reset');
    refChange('quiet');
    refChange('start');
    const engine = new Engine();
    expect(engine instanceof Engine).toBe(true);
    engine.release();
    let outstanding = refChange('dump');
    expect(outstanding).toBe(0);
    refChange('quiet');
    refChange('reset');
    // Here goes...
    refChange('quiet');
    refChange('start');
    engine.addRef();
    engine.release();
    outstanding = refChange('dump');
    expect(outstanding).toBe(0);
    refChange('quiet');
    refChange('reset');
  });
});
