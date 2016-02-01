import AmbientLight from 'davinci-eight/facets/AmbientLight';
import arrow from 'davinci-eight/visual/createArrow';
import DirectionalLight from 'davinci-eight/facets/DirectionalLight';
import Capability from 'davinci-eight/commands/Capability';
import Color from 'davinci-eight/core/Color';
import ColorFacet from 'davinci-eight/facets/ColorFacet';
import ArrowGeometry from 'davinci-eight/geometries/ArrowGeometry';
import CuboidGeometry from 'davinci-eight/geometries/CuboidGeometry';
import SphereGeometry from 'davinci-eight/geometries/SphereGeometry';
import Drawable from 'davinci-eight/scene/Drawable';
import GraphicsContext from 'davinci-eight/scene/GraphicsContext';
import G3 from 'davinci-eight/math/G3';
import HTMLScriptsGraphicsProgram from 'davinci-eight/materials/HTMLScriptsGraphicsProgram';
import ModelFacet from 'davinci-eight/facets/ModelFacet';
import PerspectiveCamera from 'davinci-eight/cameras/PerspectiveCamera';
import Scene from 'davinci-eight/scene/Scene';
import vector from 'davinci-eight/visual/vector';

/**
 *
 */
const eight = {
    get arrow() { return arrow },
    get AmbientLight() { return AmbientLight },
    get DirectionalLight() { return DirectionalLight },
    get Capability() { return Capability },
    get Color() { return Color },
    get ColorFacet() { return ColorFacet },
    get ArrowGeometry() { return ArrowGeometry },
    get CuboidGeometry() { return CuboidGeometry },
    get SphereGeometry() { return SphereGeometry },
    get Drawable() { return Drawable },
    get GraphicsContext() { return GraphicsContext },
    get G3() { return G3 },
    get HTMLScriptsGraphicsProgram() { return HTMLScriptsGraphicsProgram },
    get ModelFacet() { return ModelFacet },
    get Scene() { return Scene },
    get PerspectiveCamera() { return PerspectiveCamera },
    get vector() { return vector },
}

export default eight;
