import IDrawable = require('../core/IDrawable')
import IDrawList = require('../scene/IDrawList')
import IFacet = require('../core/IFacet')

interface ISlideHost {
  // FIXME: addScene would be better to allow own impls
  createScene(name: string, canvasNames: number[]): void
  deleteScene(name: string): void
  // FIXME: rename IDrawableList
  getDrawable(name: string): IDrawable
  getScene(name: string): IDrawList
  
  addDrawable(name: string, drawable: IDrawable): void
  removeDrawable(name: string): void
  
  addToScene(drawableName: string, sceneName: string): void
  removeFromScene(drawableName: string, sceneName: string): void

  addFacet(name: string, uniform: IFacet): void
  removeFacet(name: string): void
  
  addCanvasSceneLink(canvasId: number, sceneName: string): void
  addCanvasUniformLink(canvasId: number, name: string): void
}

export = ISlideHost
