import { Engine } from '../core/Engine';
import { SmartGraphicsProgram } from './SmartGraphicsProgram';

describe("SmartGraphicsProgram", function () {
  it("new-release", function () {
    const engine: Engine = new Engine();
    const material = new SmartGraphicsProgram({}, {}, false, false, false, engine);
    expect(material.isZombie()).toBe(false);
    material.release();
    expect(material.isZombie()).toBe(true);
  });
});
