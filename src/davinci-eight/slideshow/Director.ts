import Geometry = require('../geometries/Geometry')
import Slide = require('../slideshow/Slide')
import Canvas3D = require('../scene/Canvas3D')
import IDrawable = require('../core/IDrawable')
import IDrawList = require('../scene/IDrawList')
import IFacet = require('../core/IFacet')
import isDefined = require('../checks/isDefined')
import IDirector = require('../slideshow/IDirector')
import IUnknownArray = require('../collections/IUnknownArray')
import mustBeDefined = require('../checks/mustBeDefined')
import mustBeString = require('../checks/mustBeString')
import NumberIUnknownMap = require('../collections/NumberIUnknownMap')
import Scene = require('../scene/Scene')
import Shareable = require('../utils/Shareable')
import StringIUnknownMap = require('../collections/StringIUnknownMap')

/**
 * @class Director
 */
class Director extends Shareable implements IDirector {
  /**
   * [0, slides.length] represents on a slide
   * A value equal to -1 represents just before the first slide.
   * A value equal to slides.length represents just after the last slide. 
   * @property step
   * @type {number}
   */
  private step: number;
  /**
   * @property slides
   * @type {IUnknownArray<Slide>}
   */
  public slides: IUnknownArray<Slide>;
  /**
   * (canvasId: number) => Canvas3D
   */
  private contexts: NumberIUnknownMap<Canvas3D>;
  /**
   * (sceneName: string) => IDrawList
   */
  private scenes: StringIUnknownMap<IDrawList>;
  /**
   * (name: string) => IDrawable
   */
  private drawables: StringIUnknownMap<IDrawable>;
  /**
   * (name: string) => Geometry
   */
  private geometries: StringIUnknownMap<Geometry>;
  /**
   * (name: string) => IFacet
   */
  private facets: StringIUnknownMap<IFacet>;
  /**
   * (canvasId: number) => scene.name
   */
  private sceneNamesByCanvasId: { [canvasId: number]: string[] };
  /**
   * (canvasId: number) => ((facet.name) => IFacet)
   */
  private facetsByCanvasId: NumberIUnknownMap<StringIUnknownMap<IFacet>>;
  /**
   * @class Director
   * @constructor
   */
  constructor() {
    super('Director')
    this.step = -1 // Position before the first slide.
    this.slides = new IUnknownArray<Slide>([], 'Director.slides')
    this.contexts = new NumberIUnknownMap<Canvas3D>()
    this.scenes = new StringIUnknownMap<IDrawList>('Director.scenes')
    this.drawables = new StringIUnknownMap<IDrawable>('Director.drawables')
    this.geometries = new StringIUnknownMap<Geometry>('Director.geometries')
    this.facets = new StringIUnknownMap<IFacet>('Director.facets')
    this.sceneNamesByCanvasId = {}
    this.facetsByCanvasId = new NumberIUnknownMap<StringIUnknownMap<IFacet>>();
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
    this.geometries.release()
    this.geometries = void 0
    this.facets.release()
    this.facets = void 0
    this.facetsByCanvasId.release()
    this.facetsByCanvasId = void 0
  }
  addCanvas3D(context: Canvas3D): void {
    this.contexts.put(context.canvasId, context)
  }
  getCanvas3D(canvasId: number): Canvas3D {
    return this.contexts.get(canvasId)
  }
  removeCanvas3D(canvasId: number): void {
    this.contexts.remove(canvasId)
  }
  addDrawable(drawable: IDrawable, drawableName: string): void {
    this.drawables.put(drawableName, drawable)
  }
  getDrawable(drawableName: string): IDrawable {
    if (isDefined(drawableName)) {
      mustBeString('drawableName', drawableName)
      return this.drawables.get(drawableName)
    }
    else {
      return void 0
    }
  }
  removeDrawable(drawableName: string): IDrawable {
    return this.drawables.remove(drawableName)
  }
  addFacet(facet: IFacet, facetName: string): void {
    this.facets.put(facetName, facet)
  }
  getFacet(facetName: string): IFacet {
    return this.facets.get(facetName)
  }
  removeFacet(facetName: string): IFacet {
    return this.facets.remove(facetName)
  }
  addGeometry(name: string, geometry: Geometry): void {
    this.geometries.put(name, geometry)
  }
  removeGeometry(name: string): Geometry {
    return this.geometries.remove(name)
  }
  getGeometry(name: string): Geometry {
    return this.geometries.get(name)
  }
  addScene(scene: IDrawList, sceneName: string): void {
    this.scenes.put(sceneName, scene)
  }
  getScene(sceneName: string): IDrawList {
    return this.scenes.get(sceneName)
  }
  removeScene(sceneName: string): IDrawList {
    return this.scenes.remove(sceneName)
  }
  isDrawableInScene(drawableName: string, sceneName: string): boolean {
    mustBeString('drawableName', drawableName)
    mustBeString('sceneName', sceneName)

    var drawable = this.drawables.getWeakRef(drawableName)
    mustBeDefined(drawableName, drawable)
    
    var scene = this.scenes.getWeakRef(sceneName)
    mustBeDefined(sceneName, scene)

    return scene.containsDrawable(drawable)
  }
  useDrawableInScene(drawableName: string, sceneName: string, confirm: boolean): void {
    mustBeString('drawableName', drawableName)
    mustBeString('sceneName', sceneName)

    var drawable = this.drawables.getWeakRef(drawableName)
    mustBeDefined(drawableName, drawable)

    var scene = this.scenes.getWeakRef(sceneName)
    mustBeDefined(sceneName, scene)

    if (confirm) {
      scene.add(drawable)
    }
    else {
      scene.remove(drawable)
    }
  }
  useSceneOnCanvas(sceneName: string, canvasId: number, confirm: boolean) {
    var names = this.sceneNamesByCanvasId[canvasId]
    if (names) {

      // TODO: Would be better to model this as a set<string>
      var index = names.indexOf(sceneName)
      if (index < 0) {
        if (confirm) {
          names.push(sceneName)
        }
        else {
          // Do nothing, its not in the list of sceneNames.
        }
      }
      else {
        if (confirm) {
          // Do nothing, the scene name is already in the list.
        }
        else {
          names.splice(index, 1)
          if (names.length === 0) {
            delete this.sceneNamesByCanvasId[canvasId]
          }
        }
      }
    }
    else {
      if (confirm) {
        this.sceneNamesByCanvasId[canvasId] = [sceneName]
      }
      else {
        // Do nothing, there is no entry for this canvas anyway.
      }
    }
  }
  useFacetOnCanvas(facetName: string, canvasId: number, confirm: boolean) {
    // FIXME: Verify that canvasId is a legitimate canvas.
    var facet: IFacet = this.facets.get(facetName)
    if (facet) {
      try {
        var facets: StringIUnknownMap<IFacet> = this.facetsByCanvasId.get(canvasId)
        if (!facets) {
          facets = new StringIUnknownMap<IFacet>('Director');
          this.facetsByCanvasId.put(canvasId, facets)
        }
        facets.put(facetName, facet)
        facets.release()
      }
      finally {
        facet.release()
      }
    }
    else {
      console.warn(facetName + ' is not a recognized facet')
    }
  }
  /**
   * Creates a new Slide.
   * @method createSlide
   * @return {Slide}
   */
  createSlide(): Slide {
    return new Slide()
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
    var slideLeaving: Slide = this.slides.getWeakRef(this.step)
    var slideEntering: Slide = this.slides.getWeakRef(this.step + 1)
    var self = this;
    var apply = function() {
      if (slideLeaving) {
        slideLeaving.doEpilog(self, true)
      }
      if (slideEntering) {
        slideEntering.doProlog(self, true)
      }
      self.step++
    }
    if (delay) {
      setTimeout(apply, delay)
    }
    else {
      apply()
    }
  }
  canForward(): boolean {
    return this.step < this.slides.length
  }
  backward(instant: boolean = true, delay: number = 0) {
    if (!this.canBackward()) {
      return
    }
    var slideLeaving = this.slides.getWeakRef(this.step)
    var slideEntering = this.slides.getWeakRef(this.step - 1)
    var self = this;
    var apply = function() {
      if (slideLeaving) {
        slideLeaving.undo(self)
        slideLeaving.doProlog(self, false)
      }
      if (slideEntering) {
        slideEntering.doEpilog(self, false)
      }
      self.step--
    }
    if (delay) {
      setTimeout(apply, delay)
    }
    else {
      apply()
    }
  }
  canBackward(): boolean {
    return this.step > -1
  }
  pushSlide(slide: Slide): number {
    return this.slides.push(slide)
  }
  /*
  addCanvas(canvas: HTMLCanvasElement, canvasId: number): void {
    var c3d = new Canvas3D()
    c3d.start(canvas, canvasId)
    this.contexts.put(canvasId, c3d)
    c3d.release()
  }
  */
  advance(interval: number): void {
    var slideIndex = this.step
    if (slideIndex >= 0 && slideIndex < this.slides.length) {
      var slide: Slide = this.slides.get(slideIndex)
      if (slide) {
        try {
          slide.advance(interval)
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
    var director = this;
    var canvasIds: number[] = this.contexts.keys;
    for (var i = 0, iLength = canvasIds.length; i < iLength; i++) {
      var canvasId = canvasIds[i]
      var c3d = this.contexts.getWeakRef(canvasId)
      // prolog?
      var ambients: StringIUnknownMap<IFacet> = this.facetsByCanvasId.getWeakRef(canvasId)
      // FIXME: scenesByCanvasId
      var sceneNames = this.sceneNamesByCanvasId[canvasId]
      if (sceneNames) {
        for (var j = 0, jLength = sceneNames.length; j < jLength; j++) {
          var sceneName = sceneNames[j]
          var scene = this.scenes.getWeakRef(sceneName)
          scene.draw(ambients.values, canvasId)
        }
      }
    }
  }
}

export = Director
