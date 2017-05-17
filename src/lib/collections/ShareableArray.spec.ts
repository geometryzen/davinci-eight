import { ShareableArray } from './ShareableArray';
import { ShareableBase } from '../core/ShareableBase';

class Foo extends ShareableBase {
  constructor() {
    super();
    this.setLoggingName('Foo');
  }
  destructor(level: number) {
    super.destructor(level + 1);
  }
}

describe("ShareableArray", function () {
  it("new-release", function () {
    const map = new ShareableArray<Foo>();
    expect(map.isZombie()).toBe(false);
    map.release();
    expect(map.isZombie()).toBe(true);
  });
});
