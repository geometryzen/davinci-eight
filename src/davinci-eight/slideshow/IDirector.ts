import Canvas3D = require('../scene/Canvas3D')
import Geometry = require('../geometries/Geometry')
import IDrawable = require('../core/IDrawable')
import IDrawList = require('../scene/IDrawList')
import IFacet = require('../core/IFacet')
import Scene = require('../scene/Scene')

interface IDirector {
  addCanvas3D(context: Canvas3D): void;
  getCanvas3D(canvasId: number): Canvas3D;
  removeCanvas3D(canvasId: number): void;

  addDrawable(drawable: IDrawable, drawableName: string): void;
  getDrawable(drawableName: string): IDrawable;
  removeDrawable(drawableName: string): IDrawable;

  addFacet(facet: IFacet, facetName: string): void
  getFacet(facetName: string): IFacet;
  removeFacet(facetName: string): IFacet

  addGeometry(name: string, geometry: Geometry): void;
  getGeometry(name: string): Geometry;
  removeGeometry(name: string): Geometry;

  addScene(scene: IDrawList, sceneName: string): void;
  getScene(sceneName: string): IDrawList;
  removeScene(sceneName: string): IDrawList;

  isDrawableInScene(drawableName: string, sceneName: string): boolean;
  useDrawableInScene(drawableName: string, sceneName: string, confirm: boolean): void;

  useSceneOnCanvas(sceneName: string, canvasId: number, confirm: boolean): void
  useFacetOnCanvas(facetName: string, canvasId: number, confirm: boolean): void
}

export = IDirector
