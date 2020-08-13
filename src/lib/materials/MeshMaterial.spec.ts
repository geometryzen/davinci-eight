import { Engine } from '../core/Engine';
import { MeshMaterial } from './MeshMaterial';
import { MeshMaterialOptions } from '../materials/MeshMaterialOptions';
import { refChange } from '../core/refChange';
import { GLSLESVersion } from './glslVersion';

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
      expect(material.vertexShaderSrc).toContain("#version 300 es");
      expect(material.vertexShaderSrc).toContain("in vec3 aPosition;");
      expect(material.vertexShaderSrc).toContain("gl_Position");

      expect(material.fragmentShaderSrc).toContain("#version 300 es");
      expect(material.fragmentShaderSrc).toContain("precision");
      expect(material.fragmentShaderSrc).toContain("out vec4");
      material.release();
      engine.release();
      refChange('stop');
      const outstanding = refChange('dump');
      expect(outstanding).toBe(0);
      refChange('quiet');
      refChange('reset');
    });
    it("should respect GLSL version 100 override", function () {
      // FIXME: Why is the kind required?
      const matOptions: MeshMaterialOptions = { version: GLSLESVersion.OneHundred } as MeshMaterialOptions;
      refChange('quiet');
      refChange('reset');
      refChange('quiet');
      refChange('start');
      const engine: Engine = new Engine();
      const material = new MeshMaterial(engine, matOptions);
      expect(material.vertexShaderSrc).toContain("attribute vec3 aPosition;");
      expect(material.vertexShaderSrc).toContain("attribute vec3 aNormal;");
      expect(material.vertexShaderSrc).toContain("attribute vec2 aCoords;");
      expect(material.vertexShaderSrc).toContain("varying highp vec4 vColor;");
      expect(material.vertexShaderSrc).toContain("gl_Position");
      expect(material.fragmentShaderSrc).toContain("gl_FragColor");
      material.release();
      engine.release();
      refChange('stop');
      const outstanding = refChange('dump');
      expect(outstanding).toBe(0);
      refChange('quiet');
      refChange('reset');
    });
    it("should respect GLSL version 300 override", function () {
      // FIXME: Why is the kind required?
      const matOptions: MeshMaterialOptions = { version: GLSLESVersion.ThreeHundred } as MeshMaterialOptions;
      refChange('quiet');
      refChange('reset');
      refChange('quiet');
      refChange('start');
      const engine: Engine = new Engine();
      const material = new MeshMaterial(engine, matOptions);

      expect(material.vertexShaderSrc).toContain("#version 300 es");
      expect(material.vertexShaderSrc).toContain("in vec3 aPosition");
      expect(material.vertexShaderSrc).toContain("gl_Position");

      expect(material.fragmentShaderSrc).toContain("#version 300 es");
      expect(material.fragmentShaderSrc).toContain("precision");
      expect(material.fragmentShaderSrc).toContain("out vec4");

      material.release();
      engine.release();
      refChange('stop');
      const outstanding = refChange('dump');
      expect(outstanding).toBe(0);
      refChange('quiet');
      refChange('reset');
    });
    it("should respect GLSL version 300 override", function () {
      // FIXME: Why is the kind required?
      const matOptions: MeshMaterialOptions = { version: GLSLESVersion.ThreeHundred } as MeshMaterialOptions;
      refChange('quiet');
      refChange('reset');
      refChange('quiet');
      refChange('start');
      const engine: Engine = new Engine();
      const material = new MeshMaterial(engine, matOptions);

      expect(material.vertexShaderSrc).toContain("#version 300 es");
      expect(material.vertexShaderSrc).toContain("in vec3 aPosition");
      expect(material.vertexShaderSrc).toContain("gl_Position");

      expect(material.fragmentShaderSrc).toContain("#version 300 es");
      expect(material.fragmentShaderSrc).toContain("precision");
      expect(material.fragmentShaderSrc).toContain("out vec4");

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
