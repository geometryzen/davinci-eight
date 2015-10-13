import Canvas3D = require('../scene/Canvas3D')
import IDrawable = require('../core/IDrawable')
import IDrawList = require('../scene/IDrawList')
import IFacet = require('../core/IFacet')
import ISlide = require('../slideshow/ISlide')
import ISlideHost = require('../slideshow/ISlideHost')
import IUnknownArray = require('../utils/IUnknownArray')
import NumberIUnknownMap = require('../utils/NumberIUnknownMap')
import Scene = require('../scene/Scene')
import Shareable = require('../utils/Shareable')
import Slide = require('../slideshow/Slide')
import StringIUnknownMap = require('../utils/StringIUnknownMap')

class Director extends Shareable implements ISlideHost {
  private slides: IUnknownArray<ISlide>;
  private step: number;
  /**
   * (canvasId: number) => Canvas3D
   */
  private contexts: NumberIUnknownMap<Canvas3D>;
  /**
   * (sceneName: string) => Scene
   */
  private scenes: StringIUnknownMap<IDrawList>;
  /**
   * (name: string) => IUniform
   */
  private drawables: StringIUnknownMap<IDrawable>;
  /**
   * (name: string) => IUniform
   */
  private uniforms: StringIUnknownMap<IFacet>;
  /**
   * (canvasId: number) => scene.name
   */
  private sceneNamesByCanvasId: { [canvasId: number]: string[] };
  /**
   * (canvasId: number) => ((uniform.name) => IFacet)
   */
  private uniformsByCanvasId: NumberIUnknownMap<StringIUnknownMap<IFacet>>;
  constructor() {
    super('Director')
    this.slides = new IUnknownArray<ISlide>([], 'Director.slides')
    this.step = -1 // Position before the first slide.
    this.contexts = new NumberIUnknownMap<Canvas3D>()
    this.scenes = new StringIUnknownMap<IDrawList>('Director.scenes')
    this.drawables = new StringIUnknownMap<IDrawable>('Director.drawables')
    this.uniforms = new StringIUnknownMap<IFacet>('Director.uniforms')
    this.sceneNamesByCanvasId = {}
    this.uniformsByCanvasId = new NumberIUnknownMap<StringIUnknownMap<IFacet>>();
  }
  destructor(): void {
    this.slides.release()
    this.slides = void 0
    this.contexts.forEach(function(canvasId, context) {
      context.stop()
    })
    this.contexts.release()
    this.contexts = void 0
    this.scenes.release()
    this.scenes = void 0
    this.drawables.release()
    this.drawables = void 0
    this.uniforms.release()
    this.uniforms = void 0
    this.uniformsByCanvasId.release()
    this.uniformsByCanvasId = void 0
  }
  apply(slide: ISlide, forward: boolean): void {
    if (forward) {
      slide.exec(this)
    }
    else {
      slide.undo(this)
    }
  }
  addCanvasSceneLink(canvasId: number, sceneName: string) {
    var names = this.sceneNamesByCanvasId[canvasId]
    if (names) {
      names.push(sceneName)
    }
    else {
      this.sceneNamesByCanvasId[canvasId] = [sceneName]
    }
  }
  addDrawable(name: string, drawable: IDrawable): void {
    this.drawables.put(name, drawable)
  }
  getDrawable(name: string): IDrawable {
    return this.drawables.get(name)
  }
  removeDrawable(name: string): void {
    this.drawables.remove(name)
  }
  addToScene(drawableId: string, sceneId: string): void {
    var drawable = this.drawables.get(drawableId)
    var scene = this.scenes.get(sceneId)

    scene.add(drawable)

    drawable.release()
    scene.release()
  }
  removeFromScene(drawableId: string, sceneId: string): void {
    var drawable = this.drawables.get(drawableId)
    var scene = this.scenes.get(sceneId)

    scene.remove(drawable)

    drawable.release()
    scene.release()
  }
  addFacet(name: string, uniform: IFacet): void {
    this.uniforms.put(name, uniform)
  }
  removeFacet(name: string) {
    this.uniforms.remove(name)
  }
  addCanvasUniformLink(canvasId: number, uniformName: string) {
    // FIXME: Verify that canvasId is a legitimate canvas.
    var uniform: IFacet = this.uniforms.get(uniformName)
    if (uniform) {
      try {
        var uniforms: StringIUnknownMap<IFacet> = this.uniformsByCanvasId.get(canvasId)
        if (!uniforms) {
          uniforms = new StringIUnknownMap<IFacet>('Director');
          this.uniformsByCanvasId.put(canvasId, uniforms)
        }
        uniforms.put(uniformName, uniform)
        uniforms.release()
      }
      finally {
        uniform.release()
      }
    }
    else {
      console.warn(uniformName + ' is not a recognized facet')
    }
  }
  /**
   *
   */
  createScene(sceneName: string, canvasIds: number[]) {
    var contexts = this.contexts;
    var monitors: Canvas3D[] = canvasIds.map(function(canvasId) {
      return contexts.getWeakReference(canvasId)
    })
    var scene = new Scene(monitors)
    this.scenes.put(sceneName, scene)
    scene.release()
    var director = this
    canvasIds.forEach(function(canvasId) {
      director.addCanvasSceneLink(canvasId, sceneName)
    })
  }
  deleteScene(name: string) {
    if (this.scenes.exists(name)) {
      this.scenes.remove(name)
    }
  }
  createSlide(): ISlide {
    var slide = new Slide()
    this.slides.push(slide)
    return slide
  }
  getScene(name: string): IDrawList {
    return this.scenes.get(name)
  }
  go(step: number, instant: boolean = false): void {
    if (this.slides.length === 0) {
      return
    }
    while (step < 0) step += this.slides.length + 1
  }
  forward(instant: boolean = true, delay: number = 0) {
    if (!this.canForward()) {
      return
    }
    var slideIndex = this.step + 1
    var slide: ISlide = this.slides.get(slideIndex)
    try {
      var self = this;
      var apply = function() {
        self.apply(slide, true)
        self.step++
      }
      if (delay) {
        setTimeout(apply, delay)
      }
      else {
        apply()
      }
    }
    finally {
      slide.release()
    }
  }
  canForward(): boolean {
    return this.step < (this.slides.length - 1)
  }
  backward(instant: boolean = true, delay: number = 0) {
    if (!this.canBackward()) {
      return
    }
    var slideIndex = this.step - 1
    var slide = this.slides.get(slideIndex)
    var self = this;
    var apply = function() {
      self.apply(slide, false)
      self.step--
    }
    if (delay) {
      setTimeout(apply, delay)
    }
    else {
      apply()
    }
    slide.release()
  }
  canBackward(): boolean {
    return this.step > 0
  }
  pushSlide(slide: ISlide): number {
    return this.slides.push(slide)
  }
  addCanvas(canvas: HTMLCanvasElement, canvasId: number): void {
    var c3d = new Canvas3D()
    c3d.start(canvas, canvasId)
    this.contexts.put(canvasId, c3d)
    c3d.release()
  }
  update(speed: number): void {
    var slideIndex = this.step
    if (slideIndex >= 0 && slideIndex < this.slides.length) {
      var slide: ISlide = this.slides.get(slideIndex)
      if (slide) {
        try {
          slide.update(speed)
        }
        finally {
          slide.release()
        }
      }
      else {
        // This should never happen if we manage the index properly.
        console.warn("No slide found at index " + this.step)
      }
    }
  }
  render(): void {
    var slideIndex = this.step
    if (slideIndex >= 0 && slideIndex < this.slides.length) {
      var director = this;
      var canvasIds: number[] = this.contexts.keys;
      for (var i = 0, iLength = canvasIds.length; i < iLength; i++) {
        var canvasId = canvasIds[i]
        var c3d = this.contexts.get(canvasId)
        // prolog?
        c3d.release()
        var ambients: StringIUnknownMap<IFacet> = this.uniformsByCanvasId.get(canvasId)
        // FIXME: scenesByCanvasId
        var sceneNames = this.sceneNamesByCanvasId[canvasId]
        if (sceneNames) {
          for (var j = 0, jLength = sceneNames.length; j < jLength; j++) {
            var sceneName = sceneNames[j]
            var scene = this.scenes.get(sceneNames[j])
            scene.draw(ambients.values, canvasId)
            scene.release()
          }
        }
        ambients.release()
      }
    }
  }
}

export = Director
