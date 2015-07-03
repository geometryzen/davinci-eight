/// <reference path="../../../src/davinci-eight/core/DrawContext.d.ts" />
/// <reference path="../../../src/davinci-eight/cameras/Camera.d.ts" />
/// <reference path="../../../src/davinci-eight/scenes/Scene.d.ts" />
/// <reference path="../../../src/davinci-eight/renderers/Renderer.d.ts" />
/// <reference path="../../../src/davinci-eight/renderers/RendererParameters.d.ts" />
declare var renderer: (parameters?: RendererParameters) => Renderer;
export = renderer;