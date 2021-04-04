import { Engine } from '../core/Engine';
import { CylinderGeometry } from './CylinderGeometry';
// import CylinderGeometryOptions from './CylinderGeometryOptions';
// import vec from '../math/R3';

// const e1 = vec(1, 0, 0);
// const e2 = vec(0, 1, 0);
// const e3 = vec(0, 0, 1);

describe("CylinderGeometry", function () {
    describe("constructor", function () {
        describe("radius property", function () {
            it("should default to unity", function () {
                const engine = new Engine();
                const cylinder = new CylinderGeometry(engine);
                cylinder.release();
                engine.release();
                // TODO
                expect(true).toBeTrue();
            });
        });
    });
});
