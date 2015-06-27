/// <reference path="./Material.d.ts" />
/// <reference path="../geometries/Geometry.d.ts" />

var material = function(spec?): Material {

  var program: WebGLProgram;

  var publicAPI: Material =
  {
    get attributes(): string[] {
      return [];
    },
    contextFree: function(): void {

    },
    contextGain: function(): void {

    },
    contextLoss: function(): void {

    },
    hasContext: function(): boolean {
      return !!program;
    },
    enableVertexAttributes(context: WebGLRenderingContext) {
    },
    disableVertexAttributes(context: WebGLRenderingContext) {
    },
    bindVertexAttributes(context: WebGLRenderingContext) {
    },
    get program(): WebGLProgram {return program;},
    get programId(): string {return Math.random().toString();},
    update(context: WebGLRenderingContext, time: number, geometry: Geometry): void {
      // Nothing to do right now.
    }
  };

  return publicAPI;
};

export = material;