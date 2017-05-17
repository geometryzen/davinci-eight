import { Engine } from '../core/Engine';
import { HollowCylinder } from './HollowCylinder';

describe("HollowCylinder", function () {
    it("new-release", function () {
        const engine = new Engine();
        const cylinder = new HollowCylinder(engine);
        //        expect(cylinder.isZombie()).toBe(false);
        cylinder.release();
        //        expect(cylinder.isZombie()).toBe(true);
        engine.release();
    });
});
