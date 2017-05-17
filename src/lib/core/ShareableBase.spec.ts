import { ShareableBase } from './ShareableBase';
import { refChange } from '../core/refChange';

// Example of using ShareableBase as a base class in order to implement reference counting.
// When all references have been released, the destructor function is called. 
class Recyclable extends ShareableBase {
  // This test flag is used to check that the destructor has been called.
  public isCleanedUp = false;
  constructor(levelUp = 0) {
    super();
    this.setLoggingName('Recyclable');
    // You may then allocate resources here or in methods.
  }
  /**
   * This looks similar to the constructor.
   */
  protected resurrector(levelUp: number): void {
    // The first thing you should do is call the base class resurector, incrementing the level.
    super.resurrector(levelUp + 1);
    this.setLoggingName('Recyclable');
    // You may then re-allocate resources here or in methods.
  }
  protected destructor(levelUp: number): void {
    this.isCleanedUp = true;
    // The last thing you should do is to call the base class destructor, incrementing the level.
    super.destructor(levelUp + 1);
  }
}

/**
 * A mortal does not have a resurrector method.
 * We expect addRef on the zombie to throw an exception.
 */
class Mortal extends ShareableBase {
  // This test flag is used to check that the destructor has been called.
  public isCleanedUp = false;
  constructor(levelUp = 0) {
    super();
    this.setLoggingName('Mortal');
    // You may then allocate resources here or in methods.
  }
  protected destructor(levelUp: number): void {
    this.isCleanedUp = true;
    // The last thing you should do is to call the base class destructor, incrementing the level.
    super.destructor(levelUp + 1);
  }
}

describe("ShareableBase", function () {
  describe("constructor", function () {
    it("destructor", function () {
      refChange('quiet');
      refChange('reset');
      refChange('quiet');
      refChange('start');
      const foo = new Recyclable();
      expect(foo.isCleanedUp).toBe(false);
      expect(foo.isZombie()).toBe(false);
      const refCount = foo.release();
      expect(refCount).toBe(0);
      expect(foo.isCleanedUp).toBe(true);
      expect(foo.isZombie()).toBe(true);
      refChange('stop');
      const outstanding = refChange('dump');
      expect(outstanding).toBe(0);
      refChange('quiet');
      refChange('reset');
    });
    it("resurrection of a Recyclable", function () {
      let refCount: number;
      let outstanding: number;
      refChange('quiet');
      refChange('reset');
      refChange('quiet');
      refChange('start');
      const foo = new Recyclable();
      expect(foo.isCleanedUp).toBe(false);
      expect(foo.isZombie()).toBe(false);
      refCount = foo.release();
      expect(refCount).toBe(0);
      expect(foo.isCleanedUp).toBe(true);
      expect(foo.isZombie()).toBe(true);
      refChange('stop');
      outstanding = refChange('dump');
      expect(outstanding).toBe(0);
      refChange('quiet');
      refChange('reset');
      // Here it comes...
      refChange('quiet');
      refChange('start');
      refCount = foo.addRef();
      expect(refCount).toBe(1);
      refCount = foo.release();
      expect(refCount).toBe(0);
      refChange('stop');
      outstanding = refChange('dump');
      expect(outstanding).toBe(0);
      refChange('quiet');
      refChange('reset');
    });
    it("resurrection of a Mortal", function () {
      let refCount: number;
      let outstanding: number;
      refChange('quiet');
      refChange('reset');
      refChange('quiet');
      refChange('start');
      const foo = new Mortal();
      expect(foo.isCleanedUp).toBe(false);
      expect(foo.isZombie()).toBe(false);
      refCount = foo.release();
      expect(refCount).toBe(0);
      expect(foo.isCleanedUp).toBe(true);
      expect(foo.isZombie()).toBe(true);
      refChange('stop');
      outstanding = refChange('dump');
      expect(outstanding).toBe(0);
      refChange('quiet');
      refChange('reset');
      // Here it comes...
      refChange('quiet');
      refChange('start');
      expect(function () { foo.addRef(); }).toThrow(new Error("`protected resurrector(levelUp: number): void` method should be implemented by `Mortal`."));
      refChange('stop');
      outstanding = refChange('dump');
      expect(outstanding).toBe(0);
      refChange('quiet');
      refChange('reset');
    });
  });
});
