define([
  'davinci-eight/glsl/NodeWalker',
  'davinci-eight/glsl/DebugNodeEventHandler',
  'davinci-eight/glsl/DefaultNodeEventHandler',
  'davinci-eight/glsl/parse'
],
function(NodeWalker, DebugNodeEventHandler, DefaultNodeEventHandler, parse)
{
  var vertexShader = [
  "attribute vec3 aVertexPosition, aVertexThing;",
  "attribute vec3 aVertexColor;",
  "attribute vec3 aVertexNormal;",
  "",
  "uniform mat4 uMVMatrix;",
  "uniform mat3 uNormalMatrix;",
  "uniform mat4 uPMatrix;",
  "",
  "varying highp vec4 vColor;",
  "varying highp vec3 vLight;",
  "",
  "void main(void) {",
  "  gl_Position = aVertexPosition;",
  "}"
  ].join("");
  describe("vertex Shader", function() {
    it("constructor", function() {
        var walker = new NodeWalker();
        var handler = new DefaultNodeEventHandler();
        var program = parse(vertexShader);
        walker.walk(program, handler);
        expect(1).toBe(1);
    });
  });
});