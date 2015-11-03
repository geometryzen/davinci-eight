import FontFace = require('../geometries/FontFace')
import generateTextShapes = require('../geometries/generateTextShapes')
// import ExtrudeSimplexGeometry = require('../geometries/ExtrudeSimplexGeometry')
import SimplexGeometry = require('../geometries/SimplexGeometry')

function futzParameters(parameters: { amount?: number; bevelEnabled?: boolean, bevelSize?: number, bevelThickness?: number; height?: number }) {

    parameters.amount = parameters.height !== undefined ? parameters.height : 50

    // defaults

    if (parameters.bevelThickness === undefined) parameters.bevelThickness = 10
    if (parameters.bevelSize === undefined) parameters.bevelSize = 8
    if (parameters.bevelEnabled === undefined) parameters.bevelEnabled = false

    return parameters
}

/**
 * Intentionally undocumented
 */
class TextSimplexGeometry extends /*Extrude*/SimplexGeometry {
    constructor(text: string, face: FontFace, parameters: { amount?: number; bevelEnabled?: boolean, bevelSize?: number, bevelThickness?: number; height?: number }) {
        super()
        var shapes = generateTextShapes(text, face, parameters)
        //    super(generateTextShapes(text, parameters), parameters, 'TextSimplexGeometry')
    }
}

export = TextSimplexGeometry