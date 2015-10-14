import Geometry = require('../geometries/Geometry');
import IDrawable = require('../core/IDrawable');
import IDrawList = require('../scene/IDrawList');
import IFacet = require('../core/IFacet');
interface ISlideHost {
    getScene(name: string): IDrawList;
    addDrawable(name: string, drawable: IDrawable): void;
    getDrawable(name: string): IDrawable;
    removeDrawable(name: string): void;
    addGeometry(name: string, geometry: Geometry): void;
    getGeometry(name: string): Geometry;
    removeGeometry(name: string): void;
    addToScene(drawableName: string, sceneName: string): void;
    removeFromScene(drawableName: string, sceneName: string): void;
    addFacet(name: string, uniform: IFacet): void;
    removeFacet(name: string): void;
    addCanvasSceneLink(canvasId: number, sceneName: string): void;
    addCanvasUniformLink(canvasId: number, name: string): void;
}
export = ISlideHost;
