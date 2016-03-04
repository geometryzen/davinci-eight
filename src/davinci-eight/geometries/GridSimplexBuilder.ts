import VectorE3 from '../math/VectorE3';
import Simplex from './Simplex';
import SimplexPrimitivesBuilder from './SimplexPrimitivesBuilder';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import Vector2 from '../math/Vector2';
import Vector3 from '../math/Vector3';
import mustBeFunction from '../checks/mustBeFunction';
import mustBeInteger from '../checks/mustBeInteger';

export default class GridSimplexBuilder extends SimplexPrimitivesBuilder {
    constructor(parametricFunction: (u: number, v: number) => VectorE3, uSegments: number, vSegments: number) {
        super();
        mustBeFunction('parametricFunction', parametricFunction)
        mustBeInteger('uSegments', uSegments)
        mustBeInteger('vSegments', vSegments)
        /**
         * Temporary array of points.
         */
        const points: Vector3[] = [];

        const sliceCount = uSegments + 1;

        for (let i = 0; i <= vSegments; i++) {

            const v: number = i / vSegments;

            for (let j = 0; j <= uSegments; j++) {

                const u: number = j / uSegments;

                const point: VectorE3 = parametricFunction(u, v);
                // Make a copy just in case the function is returning mutable references.
                points.push(Vector3.copy(point));
            }
        }

        let a: number;
        let b: number;
        let c: number;
        let d: number;
        let uva: Vector2;
        let uvb: Vector2;
        let uvc: Vector2;
        let uvd: Vector2;

        for (let i = 0; i < vSegments; i++) {

            for (let j = 0; j < uSegments; j++) {

                a = i * sliceCount + j;
                b = i * sliceCount + j + 1;
                c = (i + 1) * sliceCount + j + 1;
                d = (i + 1) * sliceCount + j;

                uva = new Vector2([j / uSegments, i / vSegments]);
                uvb = new Vector2([(j + 1) / uSegments, i / vSegments]);
                uvc = new Vector2([(j + 1) / uSegments, (i + 1) / vSegments]);
                uvd = new Vector2([j / uSegments, (i + 1) / vSegments]);

                let simplex = new Simplex(Simplex.TRIANGLE)
                simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[a]
                simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uva
                simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[b]
                simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvb
                simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[d]
                simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvd
                this.data.push(simplex)

                simplex = new Simplex(Simplex.TRIANGLE)
                simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[b]
                simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvb
                simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[c]
                simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvc
                simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[d]
                simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvd
                this.data.push(simplex)
            }
        }

        //    this.computeFaceNormals();
        //    this.computeVertexNormals();
    }
}
