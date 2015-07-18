/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />

import AttributeMetaInfos = require('davinci-eight/core/AttributeMetaInfos');
import AmbientLight = require('davinci-eight/uniforms/AmbientLight');
import core = require('davinci-eight/core');
import Node3D = require('davinci-eight/core/Node3D');
import object3D = require('davinci-eight/core/object3D');
import view = require('davinci-eight/cameras/view');
import Color = require('davinci-eight/core/Color');
import ChainedVertexUniformProvider = require('davinci-eight/objects/ChainedVertexUniformProvider');
import View = require('davinci-eight/cameras/View');
import LinearPerspectiveCamera = require('davinci-eight/cameras/LinearPerspectiveCamera');
import perspective = require('davinci-eight/cameras/perspective');
import world = require('davinci-eight/worlds/world');
import World = require('davinci-eight/worlds/World');
import renderer = require('davinci-eight/renderers/renderer');
import WebGLRenderer = require('davinci-eight/renderers/WebGLRenderer');
import drawableModel = require('davinci-eight/objects/drawableModel');
import VertexUniformProvider = require('davinci-eight/core/VertexUniformProvider');
import webGLContextMonitor = require('davinci-eight/utils/webGLContextMonitor');
import workbench3D = require('davinci-eight/utils/workbench3D');
import windowAnimationRunner = require('davinci-eight/utils/windowAnimationRunner');
import Face3 = require('davinci-eight/core/Face3');
import Geometry = require('davinci-eight/geometries/Geometry');
import GeometryAdapter = require('davinci-eight/geometries/GeometryAdapter');
import ArrowGeometry = require('davinci-eight/geometries/ArrowGeometry');
import BoxGeometry = require('davinci-eight/geometries/BoxGeometry');
import CylinderGeometry = require('davinci-eight/geometries/CylinderGeometry');
import DodecahedronGeometry = require('davinci-eight/geometries/DodecahedronGeometry');
import IcosahedronGeometry = require('davinci-eight/geometries/IcosahedronGeometry');
import KleinBottleGeometry = require('davinci-eight/geometries/KleinBottleGeometry');
import MobiusStripGeometry = require('davinci-eight/geometries/MobiusStripGeometry');
import OctahedronGeometry = require('davinci-eight/geometries/OctahedronGeometry');
import ParametricGeometry = require('davinci-eight/geometries/ParametricGeometry');
import PolyhedronGeometry = require('davinci-eight/geometries/PolyhedronGeometry');
import RevolutionGeometry = require('davinci-eight/geometries/RevolutionGeometry');
import SphereGeometry = require('davinci-eight/geometries/SphereGeometry');
import TetrahedronGeometry = require('davinci-eight/geometries/TetrahedronGeometry');
import TubeGeometry = require('davinci-eight/geometries/TubeGeometry');
import VortexGeometry = require('davinci-eight/geometries/VortexGeometry');
import pointsProgram = require('davinci-eight/programs/pointsProgram');
import shaderProgram = require('davinci-eight/programs/shaderProgram');
import smartProgram = require('davinci-eight/programs/smartProgram');
import ShaderAttributeVariable = require('davinci-eight/core/ShaderAttributeVariable');
import ShaderUniformVariable = require('davinci-eight/core/ShaderUniformVariable');
import Matrix3 = require('davinci-eight/math/Matrix3');
import Matrix4 = require('davinci-eight/math/Matrix4');
import Spinor3 = require('davinci-eight/math/Spinor3');
import Vector2 = require('davinci-eight/math/Vector2');
import Vector3 = require('davinci-eight/math/Vector3');
import DrawableModel = require('davinci-eight/objects/DrawableModel');
import Curve = require('davinci-eight/curves/Curve');
import Model = require('davinci-eight/objects/Model');
import UniformMetaInfo = require('davinci-eight/core/UniformMetaInfo');
import UniformMetaInfos = require('davinci-eight/core/UniformMetaInfos');
import VertexAttributeProvider = require('davinci-eight/core/VertexAttributeProvider');
import ShaderProgram = require('davinci-eight/programs/ShaderProgram');
import Renderer = require('davinci-eight/renderers/Renderer');
import RendererParameters = require('davinci-eight/renderers/RendererParameters');
/*
import BoxVertexAttributeProvider = require('davinci-eight/mesh/BoxVertexAttributeProvider');
import CuboidVertexAttributeProvider = require('davinci-eight/mesh/CuboidVertexAttributeProvider');
import CurveGeometry = require('davinci-eight/mesh/CurveGeometry');
import EllipsoidGeometry = require('davinci-eight/mesh/EllipsoidGeometry');
import LatticeVertexAttributeProvider = require('davinci-eight/mesh/LatticeVertexAttributeProvider');
import box = require('davinci-eight/mesh/box');
import prism = require('davinci-eight/mesh/prism');
import cuboid = require('davinci-eight/mesh/cuboid');
import ellipsoid = require('davinci-eight/mesh/ellipsoid');
import RGBGeometry = require('davinci-eight/mesh/RGBGeometry');
*/

/**
 * @module EIGHT
 */
var eight = {
    /**
     * The semantic version of the library.
     * @property VERSION
     * @type String
     */
    'VERSION': core.VERSION,
    get view() { return view; },
    perspective: perspective,
    get world() { return world; },
    object3D: object3D,
    renderer: renderer,
    contextMonitor: webGLContextMonitor,
    workbench: workbench3D,
    animationRunner: windowAnimationRunner,
    get drawableModel() { return drawableModel; },
    get ShaderAttributeVariable() { return ShaderAttributeVariable; },
    get ShaderUniformVariable() { return ShaderUniformVariable; },
    get pointsProgram() {
      return pointsProgram;
    },
    get shaderProgram() {
      return shaderProgram;
    },
    get smartProgram() {
      return smartProgram;
    },
    get AmbientLight() { return AmbientLight; },
    get WebGLRenderer() { return WebGLRenderer; },
    get Color() { return Color; },
    get Face3() { return Face3; },
    get Geometry() { return Geometry; },
    get GeometryAdapter() { return GeometryAdapter; },
    get ArrowGeometry() { return ArrowGeometry; },
    get BoxGeometry() { return BoxGeometry; },
    get CylinderGeometry() { return CylinderGeometry; },
    get DodecahedronGeometry() { return DodecahedronGeometry; },
    get IcosahedronGeometry() { return IcosahedronGeometry; },
    get KleinBottleGeometry() { return KleinBottleGeometry; },
    get MobiusStripGeometry() { return MobiusStripGeometry; },
    get OctahedronGeometry() { return OctahedronGeometry; },
    get ParametricGeometry() { return ParametricGeometry; },
    get PolyhedronGeometry() { return PolyhedronGeometry; },
    get RevolutionGeometry() { return RevolutionGeometry; },
    get SphereGeometry() { return SphereGeometry; },
    get TetrahedronGeometry() { return TetrahedronGeometry; },
    get TubeGeometry() { return TubeGeometry; },
    get VortexGeometry() { return VortexGeometry; },
    get Model() { return Model; },
    get Matrix3() { return Matrix3; },
    get Matrix4() { return Matrix4; },
    get Spinor3() { return Spinor3; },
    get Vector2() { return Vector2; },
    get Vector3() { return Vector3; },
    get Curve() { return Curve; },
    get ChainedVertexUniformProvider() { return ChainedVertexUniformProvider; },
    /*
    get box() { return box; },
    get BoxVertexAttributeProvider() { return BoxVertexAttributeProvider; },
    get cuboid() { return cuboid; },
    get ellipsoid() { return ellipsoid; },
    prism: prism,
    CurveGeometry: CurveGeometry,
    LatticeVertexAttributeProvider: LatticeVertexAttributeProvider,
    RGBGeometry: RGBGeometry,
    */
};
export = eight;
