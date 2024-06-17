import { GLSLESVersion } from "./glslVersion";
import { glslVersionFromWebGLContextId } from "./glslVersionFromWebGLContextId";

describe("glslVersionFromWebGLContextId", function () {
    describe("with undefined override", function () {
        it("(undefined, undefined) => Latest (300)", function () {
            expect(glslVersionFromWebGLContextId(void 0, void 0)).toBe(GLSLESVersion.ThreeHundred);
        });

        it("(undefined, null) => Latest (300)", function () {
            expect(glslVersionFromWebGLContextId(void 0, null)).toBe(GLSLESVersion.ThreeHundred);
        });

        it("(undefined, 'webgl2') => 300", function () {
            expect(glslVersionFromWebGLContextId(void 0, "webgl2")).toBe(GLSLESVersion.ThreeHundred);
        });

        it("(undefined, 'webgl') => 100", function () {
            expect(glslVersionFromWebGLContextId(void 0, "webgl")).toBe(GLSLESVersion.OneHundred);
        });
    });

    describe("with defined override", function () {
        it("(300, undefined) => 300", function () {
            expect(glslVersionFromWebGLContextId(GLSLESVersion.ThreeHundred, void 0)).toBe(GLSLESVersion.ThreeHundred);
        });

        it("(100, undefined) => 300", function () {
            expect(glslVersionFromWebGLContextId(GLSLESVersion.OneHundred, void 0)).toBe(GLSLESVersion.OneHundred);
        });

        it("(300, 'webgl2') => 300", function () {
            expect(glslVersionFromWebGLContextId(GLSLESVersion.ThreeHundred, "webgl2")).toBe(GLSLESVersion.ThreeHundred);
        });

        it("(300, 'webgl') => 300", function () {
            expect(glslVersionFromWebGLContextId(GLSLESVersion.ThreeHundred, "webgl")).toBe(GLSLESVersion.ThreeHundred);
        });

        it("(100, 'webgl2') => 100", function () {
            expect(glslVersionFromWebGLContextId(GLSLESVersion.OneHundred, "webgl")).toBe(GLSLESVersion.OneHundred);
        });

        it("(100, 'webgl') => 100", function () {
            expect(glslVersionFromWebGLContextId(GLSLESVersion.OneHundred, "webgl")).toBe(GLSLESVersion.OneHundred);
        });
    });
});
