import { Engine } from '../core/Engine';
import { PointMaterial } from './PointMaterial';
import { PointMaterialOptions } from '../materials/PointMaterialOptions';
import { refChange } from '../core/refChange';

describe("PointMaterial", function () {
    it("constructor-destructor", function () {
        const matOptions: PointMaterialOptions = void 0;
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine: Engine = new Engine();
        const material = new PointMaterial(engine, matOptions);
        expect(material.isZombie()).toBe(false);
        material.release();
        engine.release();
        expect(material.isZombie()).toBe(true);
        refChange('stop');
        const outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
    });
    it("resurrector-destructor", function () {
        const matOptions: PointMaterialOptions = void 0;
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine: Engine = new Engine();
        const material = new PointMaterial(engine, matOptions);
        expect(material.isZombie()).toBe(false);
        material.release();
        engine.release();
        expect(material.isZombie()).toBe(true);
        refChange('stop');
        let outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
        // Here goes...
        refChange('quiet');
        refChange('start');
        engine.addRef();
        material.addRef();
        expect(material.isZombie()).toBe(false);
        material.release();
        engine.release();
        expect(material.isZombie()).toBe(true);
        refChange('stop');
        outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
    });
});
