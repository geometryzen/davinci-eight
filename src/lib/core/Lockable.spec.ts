import { applyMixins } from '../utils/applyMixins';
import { LockableMixin } from './Lockable';

// See
// https://www.typescriptlang.org/docs/handbook/mixins.html

/**
 * WARNING: property getter and setter don't work with this mixin approach.
 * Notice that isLocked is now a standard function.
 * @hidden
 */
class HAL {
    changeMe(): void {
        if (this.isLocked()) {
            throw new Error("I'm sorry, Dave. I'm afraid I can't do that.");
        }
    }
}
interface HAL extends LockableMixin { }
// applyMixins(HAL, [LockableMixin]);

describe("Lockable", function () {
    describe("mixin", function () {
        applyMixins(HAL, [LockableMixin]);
        const chameleon = new HAL();
        it("isLocked should ", function () {
            expect(typeof chameleon.isLocked).toBe('function');
            expect(chameleon.isLocked()).toBeFalsy();
            chameleon.changeMe();
            chameleon.lock();
            expect(chameleon.isLocked()).toBeTruthy();
            expect(function () {
                chameleon.changeMe();
            }).toThrow(new Error("I'm sorry, Dave. I'm afraid I can't do that."));
        });
    });
});
