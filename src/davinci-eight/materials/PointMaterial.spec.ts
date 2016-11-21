import { Engine } from '../core/Engine';
import { PointMaterial } from './PointMaterial';
import PointMaterialOptions from '../materials/PointMaterialOptions';

describe("PointMaterial", function () {
    it("new-release", function () {
        const matOptions: PointMaterialOptions = void 0;
        const engine: Engine = new Engine();
        const material = new PointMaterial(engine, matOptions);
        expect(material.isZombie()).toBe(false);
        material.release();
        expect(material.isZombie()).toBe(true);
        engine.release();
    });
});
