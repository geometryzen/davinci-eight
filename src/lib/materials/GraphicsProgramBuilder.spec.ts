import { GraphicsProgramBuilder } from './GraphicsProgramBuilder';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';

function split(text: string): string[] {
    return text.split('\n');
}

function isSingleLineComment(line: string): boolean {
    return line.length >= 2 && line.substring(0, 2) === '//';
}

function isCodeLine(line: string): boolean {
    return !isSingleLineComment(line);
}

function stripWS(line: string): string {
    return line.trim();
}

describe("GraphicsProgramBuilder", function () {
    describe("minimal", function () {
        const gpb = new GraphicsProgramBuilder();
        const vs = gpb.vertexShaderSrc();
        const fs = gpb.fragmentShaderSrc();
        it("vertexShader", function () {
            const text = split(vs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("void main(void) { gl_Position = vec4(0.0, 0.0, 0.0, 1.0); }");
        });
        it("fragmentShader", function () {
            const text = split(fs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("void main(void) { gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); }");
        });
    });
    describe("attribute vec4 aPosition;", function () {
        const gpb = new GraphicsProgramBuilder();
        gpb.attribute('aPosition', 4);
        const vs = gpb.vertexShaderSrc();
        const fs = gpb.fragmentShaderSrc();
        it("vertexShader", function () {
            const text = split(vs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("attribute vec4 aPosition; void main(void) { gl_Position = aPosition; }");
        });
        it("fragmentShader", function () {
            const text = split(fs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("void main(void) { gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); }");
        });
    });
    describe("attribute vec3 aPosition;", function () {
        const gpb = new GraphicsProgramBuilder();
        gpb.attribute('aPosition', 3);
        const vs = gpb.vertexShaderSrc();
        const fs = gpb.fragmentShaderSrc();
        it("vertexShader", function () {
            const text = split(vs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("attribute vec3 aPosition; void main(void) { gl_Position = vec4(aPosition, 1.0); }");
        });
        it("fragmentShader", function () {
            const text = split(fs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("void main(void) { gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); }");
        });
    });
    describe("attribute vec2 aPosition;", function () {
        const gpb = new GraphicsProgramBuilder();
        gpb.attribute('aPosition', 2);
        const vs = gpb.vertexShaderSrc();
        const fs = gpb.fragmentShaderSrc();
        it("vertexShader", function () {
            const text = split(vs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("attribute vec2 aPosition; void main(void) { gl_Position = vec4(aPosition, 0.0, 1.0); }");
        });
        it("fragmentShader", function () {
            const text = split(fs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("void main(void) { gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); }");
        });
    });
    describe("attribute vec3 aColor;", function () {
        const gpb = new GraphicsProgramBuilder();
        gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_COLOR, 3);
        const vs = gpb.vertexShaderSrc();
        const fs = gpb.fragmentShaderSrc();
        it("vertexShader", function () {
            const text = split(vs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("attribute vec3 aColor; varying highp vec4 vColor; void main(void) { gl_Position = vec4(0.0, 0.0, 0.0, 1.0); vColor = vec4(aColor, 1.0); }");
        });
        it("fragmentShader", function () {
            const text = split(fs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("varying highp vec4 vColor; void main(void) { gl_FragColor = vColor; }");
        });
    });
    describe("attribute vec4 aColor;", function () {
        const gpb = new GraphicsProgramBuilder();
        gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_COLOR, 4);
        const vs = gpb.vertexShaderSrc();
        const fs = gpb.fragmentShaderSrc();
        it("vertexShader", function () {
            const text = split(vs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("attribute vec4 aColor; varying highp vec4 vColor; void main(void) { gl_Position = vec4(0.0, 0.0, 0.0, 1.0); vColor = aColor; }");
        });
        it("fragmentShader", function () {
            const text = split(fs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("varying highp vec4 vColor; void main(void) { gl_FragColor = vColor; }");
        });
    });
    describe("attribute vec2 aCoord;", function () {
        const gpb = new GraphicsProgramBuilder();
        gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_COORDS, 2);
        const vs = gpb.vertexShaderSrc();
        const fs = gpb.fragmentShaderSrc();
        it("vertexShader", function () {
            const text = split(vs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("attribute vec2 aCoords; varying highp vec2 vCoords; void main(void) { gl_Position = vec4(0.0, 0.0, 0.0, 1.0); vCoords = aCoords; }");
        });
        it("fragmentShader", function () {
            const text = split(fs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("varying highp vec2 vCoords; void main(void) { gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); }");
        });
    });
    describe("attribute vec2 aCoord; uniform sampler2D uImage", function () {
        const gpb = new GraphicsProgramBuilder();
        gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_COORDS, 2);
        gpb.uniform(GraphicsProgramSymbols.UNIFORM_IMAGE, 'sampler2D');
        const vs = gpb.vertexShaderSrc();
        const fs = gpb.fragmentShaderSrc();
        it("vertexShader", function () {
            const text = split(vs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("attribute vec2 aCoords; varying highp vec2 vCoords; void main(void) { gl_Position = vec4(0.0, 0.0, 0.0, 1.0); vCoords = aCoords; }");
        });
        it("fragmentShader", function () {
            const text = split(fs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("varying highp vec2 vCoords; uniform sampler2D uImage; void main(void) { gl_FragColor = texture2D(uImage, vCoords); }");
        });
    });
    describe("attribute vec2 aCoord; uniform sampler2D uImage", function () {
        const gpb = new GraphicsProgramBuilder();
        gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_COORDS, 2);
        gpb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3');
        gpb.uniform(GraphicsProgramSymbols.UNIFORM_IMAGE, 'sampler2D');
        const vs = gpb.vertexShaderSrc();
        const fs = gpb.fragmentShaderSrc();
        it("vertexShader", function () {
            const text = split(vs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("attribute vec2 aCoords; uniform vec3 uColor; varying highp vec4 vColor; varying highp vec2 vCoords; void main(void) { gl_Position = vec4(0.0, 0.0, 0.0, 1.0); vColor = vec4(uColor, 1.0); vCoords = aCoords; }");
        });
        it("fragmentShader", function () {
            const text = split(fs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("varying highp vec4 vColor; varying highp vec2 vCoords; uniform sampler2D uImage; void main(void) { gl_FragColor = texture2D(uImage, vCoords) * vColor; }");
        });
    });
    describe("attribute vec2 aCoord; uniform sampler2D uImage", function () {
        const gpb = new GraphicsProgramBuilder();
        gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_COORDS, 2);
        gpb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3');
        gpb.uniform(GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT, 'vec3');
        gpb.uniform(GraphicsProgramSymbols.UNIFORM_IMAGE, 'sampler2D');
        const vs = gpb.vertexShaderSrc();
        const fs = gpb.fragmentShaderSrc();
        it("vertexShader", function () {
            const text = split(vs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("attribute vec2 aCoords; uniform vec3 uColor; uniform vec3 uAmbientLight; varying highp vec4 vColor; varying highp vec2 vCoords; varying highp vec3 vLight; void main(void) { gl_Position = vec4(0.0, 0.0, 0.0, 1.0); vColor = vec4(uColor, 1.0); vCoords = aCoords; vLight = uAmbientLight; }");
        });
        it("fragmentShader", function () {
            const text = split(fs).filter(isCodeLine).map(stripWS).join(' ').trim();
            expect(text).toBe("varying highp vec4 vColor; varying highp vec2 vCoords; varying highp vec3 vLight; uniform sampler2D uImage; void main(void) { gl_FragColor = texture2D(uImage, vCoords) * vec4(vColor.xyz * vLight, vColor.a); }");
        });
    });
});
