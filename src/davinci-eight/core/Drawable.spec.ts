import { Drawable } from './Drawable';
import { Engine } from './Engine';
import refChange from './refChange';
import BoxGeometry from '../geometries/BoxGeometry';
import { MeshMaterial } from '../materials/MeshMaterial';
import MeshMaterialOptions from '../materials/MeshMaterialOptions';

describe("Drawable", function () {
  describe("(void 0, void 0, engine)", function () {
    it("refChange", function () {
      refChange('quiet');
      refChange('reset');
      refChange('quiet');
      refChange('start');
      const engine = new Engine();
      const drawable = new Drawable(void 0, void 0, engine);
      drawable.release();
      engine.release();
      const outstanding = refChange('stop');
      expect(outstanding).toBe(0);
      if (outstanding) {
        refChange('dump');
      }
    });
  });
  describe("(geometry, material, contextManager)", function () {
    it("refChange", function () {
      refChange('quiet');
      refChange('reset');
      refChange('quiet');
      refChange('start');
      const engine = new Engine();
      const geometry = new BoxGeometry(engine);
      const matOptions: MeshMaterialOptions = {};
      const material = new MeshMaterial(engine, matOptions);
      const drawable = new Drawable(geometry, material, engine);
      geometry.release();
      material.release();
      engine.release();
      drawable.release();
      const outstanding = refChange('stop');
      expect(outstanding).toBe(0);
      if (outstanding) {
        refChange('dump');
      }
    });
  });
});
