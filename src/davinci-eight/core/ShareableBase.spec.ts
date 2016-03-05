import ShareableBase from './ShareableBase'

// Example of using ShareableBase as a base class in order to implement reference counting.
// When all references have been released, the destructor function is called. 
class Foo extends ShareableBase {
    // This test flag is used to check that the destructor has been called.
    public isCleanedUp = false
    constructor() {
        // The first thing you must do is to call the super class constructor.
        // TypeScript requires this to be the first thing that you do.
        super('Foo')
        // You may then allocate resources here or in methods.
    }
    protected destructor(): void {
      this.isCleanedUp = true
      // The last thing you should do is to call the base class destructor.
      // 
      super.destructor()
    }
}

describe("ShareableBase", function() {
    describe("constructor", function() {
        it("should create a live instance", function() {
            const foo = new Foo()
            expect(foo.isCleanedUp).toBe(false)
            expect(foo.isZombie()).toBe(false)
            const refCount = foo.release()
            expect(refCount).toBe(0)
            expect(foo.isCleanedUp).toBe(true)
            expect(foo.isZombie()).toBe(true)
        })
    })
})
