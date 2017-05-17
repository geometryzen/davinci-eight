import { Engine } from '../core/Engine';
import { CurveGeometry } from './CurveGeometry';

describe("CurveGeometry", function () {
  it("new-release", function () {
    const engine = new Engine();
    const geometry = new CurveGeometry(engine);
    expect(geometry.isZombie()).toBe(false);
    geometry.release();
    expect(geometry.isZombie()).toBe(true);
    engine.release();
  });
});
