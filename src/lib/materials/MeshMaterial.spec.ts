import { Engine } from '../core/Engine';
import { MeshMaterial } from './MeshMaterial';
import { MeshMaterialOptions } from '../materials/MeshMaterialOptions';
import { refChange } from '../core/refChange';

describe("MeshMaterial", function () {
  describe("(void 0, null)", function () {
    it("constructor-destructor", function () {
      const matOptions: MeshMaterialOptions = void 0;
      refChange('quiet');
      refChange('reset');
      refChange('quiet');
      refChange('start');
      const engine: Engine = new Engine();
      const material = new MeshMaterial(engine, matOptions);
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
      const matOptions: MeshMaterialOptions = void 0;
      refChange('quiet');
      refChange('reset');
      refChange('quiet');
      refChange('start');
      const engine: Engine = new Engine();
      const material = new MeshMaterial(engine, matOptions);
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
    it("should contain aPosition", function () {
      const matOptions: MeshMaterialOptions = void 0;
      refChange('quiet');
      refChange('reset');
      refChange('quiet');
      refChange('start');
      const engine: Engine = new Engine();
      const material = new MeshMaterial(engine, matOptions);
      expect(material.vertexShaderSrc).toContain("attribute vec3 aPosition;");
      material.release();
      engine.release();
      refChange('stop');
      const outstanding = refChange('dump');
      expect(outstanding).toBe(0);
      refChange('quiet');
      refChange('reset');
    });
  });
});
