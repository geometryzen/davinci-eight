import { NumberShareableMap } from './NumberShareableMap';
import { ShareableBase } from '../core/ShareableBase';

class Foo extends ShareableBase {
  constructor() {
    super();
    this.setLoggingName('Foo');
  }
  destructor(levelUp: number) {
    super.destructor(levelUp + 1);
  }
}

describe("NumberShareableMap", function () {
  it("new-release", function () {
    const map = new NumberShareableMap<Foo>();
    expect(map.isZombie()).toBe(false);
    map.release();
    expect(map.isZombie()).toBe(true);
  });
});
