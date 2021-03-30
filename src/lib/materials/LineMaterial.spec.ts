import { Engine } from '../core/Engine';
import { refChange } from '../core/refChange';
import { LineMaterialOptions } from '../materials/LineMaterialOptions';
import { GLSLESVersion } from './glslVersion';
import { LineMaterial } from './LineMaterial';

describe("LineMaterial", function () {
    it("constructor-destructor", function () {
        const matOptions: LineMaterialOptions = void 0;
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine: Engine = new Engine();
        const material = new LineMaterial(engine, matOptions);
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
        const matOptions: LineMaterialOptions = void 0;
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine: Engine = new Engine();
        const material = new LineMaterial(engine, matOptions);
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
        const matOptions: LineMaterialOptions = void 0;
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine: Engine = new Engine();
        const material = new LineMaterial(engine, matOptions);
        expect(material.vertexShaderSrc).toContain("vec3 aPosition;");
        material.release();
        engine.release();
        refChange('stop');
        const outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
    });
    it("should respect GLSL version 100", function () {
        const matOptions: LineMaterialOptions = { version: GLSLESVersion.OneHundred };
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine: Engine = new Engine();
        const material = new LineMaterial(engine, matOptions);

        expect(material.vertexShaderSrc).toContain("attribute vec3 aPosition;");
        expect(material.vertexShaderSrc).toContain("varying highp vec4 vColor;");
        expect(material.vertexShaderSrc).toContain("gl_Position = ");
        expect(material.vertexShaderSrc).toContain("vColor = ");

        expect(material.fragmentShaderSrc).toContain("varying highp vec4 vColor;");
        expect(material.fragmentShaderSrc).toContain("gl_FragColor = ");

        material.release();
        engine.release();
        refChange('stop');
        const outstanding = refChange('dump');
        expect(outstanding).toBe(0);
        refChange('quiet');
        refChange('reset');
    });
    it("should respect GLSL version 300", function () {
        const matOptions: LineMaterialOptions = { version: GLSLESVersion.ThreeHundred };
        refChange('quiet');
        refChange('reset');
        refChange('quiet');
        refChange('start');
        const engine: Engine = new Engine();
        const material = new LineMaterial(engine, matOptions);

        expect(material.fragmentShaderSrc).toContain("#version 300 es");
        expect(material.vertexShaderSrc).toContain("in vec3 aPosition;");
        expect(material.vertexShaderSrc).toContain("out highp vec4 vColor;");
        expect(material.vertexShaderSrc).toContain("gl_Position = ");
        expect(material.vertexShaderSrc).toContain("vColor = ");

        expect(material.fragmentShaderSrc).toContain("#version 300 es");
        expect(material.fragmentShaderSrc).toContain("in highp vec4 vColor;");
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
