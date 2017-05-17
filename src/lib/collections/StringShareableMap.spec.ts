import { StringShareableMap } from './StringShareableMap';
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

describe("StringShareableMap", function () {
  it("new-release", function () {
    const map = new StringShareableMap<Foo>();
    expect(map.isZombie()).toBe(false);
    map.release();
    expect(map.isZombie()).toBe(true);
  });
});
