import { ShareableBase } from '../core/ShareableBase';
import { exchange } from './exchange';

class Foo extends ShareableBase {
  constructor() {
    super();
    this.setLoggingName('Foo');
  }
  protected destructor(levelUp: number): void {
    super.destructor(levelUp + 1);
  }
}

describe("exchange", function () {
  it("(a, b) should return b, release a, addRef b", function () {
    const a = new Foo();
    const b = new Foo();
    expect(a.isZombie()).toBe(false);
    expect(b.isZombie()).toBe(false);
    const c = exchange(a, b);
    expect(c).toEqual(b);
    expect(a.isZombie()).toBe(true);
    expect(b.isZombie()).toBe(false);
    b.release();
    expect(b.isZombie()).toBe(false);
    b.release();
    expect(b.isZombie()).toBe(true);
  });
  it("(a, void 0) should return void 0, release a", function () {
    const a = new Foo();
    expect(a.isZombie()).toBe(false);
    const c = exchange(a, void 0);
    expect(c).toBeUndefined();
    expect(a.isZombie()).toBe(true);
  });
  it("(void 0, b) should return b, addRef b", function () {
    const b = new Foo();
    expect(b.isZombie()).toBe(false);
    const c = exchange(void 0, b);
    expect(c).toEqual(b);
    expect(b.isZombie()).toBe(false);
    b.release();
    expect(b.isZombie()).toBe(false);
    b.release();
    expect(b.isZombie()).toBe(true);
  });
  it("(a, null) should return null, release a", function () {
    const a = new Foo();
    expect(a.isZombie()).toBe(false);
    const c = exchange(a, null);
    expect(c).toBeNull();
    expect(a.isZombie()).toBe(true);
  });
  it("(null, b) should return b, addRef b", function () {
    const b = new Foo();
    expect(b.isZombie()).toBe(false);
    const c = exchange(null, b);
    expect(c).toEqual(b);
    expect(b.isZombie()).toBe(false);
    b.release();
    expect(b.isZombie()).toBe(false);
    b.release();
    expect(b.isZombie()).toBe(true);
  });
});
