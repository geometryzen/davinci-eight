import GraphicsProgramBuilder from '../materials/GraphicsProgramBuilder';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import Material from '../core/Material';

/**
 * @module EIGHT
 * @submodule materials
 */

function builder() {
    const gpb = new GraphicsProgramBuilder();

    gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, 3);

    gpb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_POINT_SIZE, 'float');

    return gpb
}

function vertexShader(): string {
    return builder().vertexShader();
}

function fragmentShader(): string {
    return builder().fragmentShader();
}

/**
 * @class PointMaterial
 * @extends Material
 */
export default class PointMaterial extends Material {
    /**
     * @class PointMaterial
     * @constructor
     */
    constructor() {
        super(vertexShader(), fragmentShader());
    }
}
