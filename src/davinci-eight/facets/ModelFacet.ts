import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
import Matrix3 from '../math/Matrix3';
import Matrix4 from '../math/Matrix4';
import ModelE3 from './ModelE3';
import mustBeObject from '../checks/mustBeObject';
import readOnly from '../i18n/readOnly';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';

/**
 *
 */
export class ModelFacet extends ModelE3 implements Facet {

    /**
     * @default diag(1, 1, 1, 1)
     */
    private matS: Matrix4 = Matrix4.one();

    private _matM = Matrix4.one();
    private _matN = Matrix3.one();
    private matR = Matrix4.one();
    private matT = Matrix4.one();

    /**
     * <p>
     * A collection of properties governing GLSL uniforms for Rigid Body Modeling.
     * </p>
     * <p>
     * In Physics, the composite object may represent a rigid body.
     * In Computer Graphics, the composite object is a collection of drawing primitives.
     * </p>
     * <p>
     * ModelFacet implements Facet required for manipulating a composite object.
     * </p>
     * <p>
     * Constructs a ModelFacet at the origin and with unity attitude.
     * </p>
     */
    constructor() {
        super();
        this.X.modified = true;
        this.R.modified = true;
        this.matS.modified = true;
    }

    /**
     * Stress (tensor)
     */
    get stress(): Matrix4 {
        return this.matS;
    }
    set stress(stress: Matrix4) {
        mustBeObject('stress', stress);
        this.matS.copy(stress);
    }

    /**
     *
     * @readOnly
     */
    get matrix(): Matrix4 {
        return this._matM;
    }
    set matrix(unused: Matrix4) {
        throw new Error(readOnly('matrix').message);
    }

    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void {
        this.updateMatrices();
        visitor.matrix4fv(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, this._matM.elements, false);
        visitor.matrix3fv(GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX, this._matN.elements, false);
    }

    private updateMatrices(): void {
        let modified = false;

        if (this.X.modified) {
            this.matT.translation(this.X);
            this.X.modified = false;
            modified = true;
        }
        if (this.R.modified) {
            this.matR.rotation(this.R);
            this.R.modified = false;
            modified = true;
        }
        if (this.matS.modified) {
            modified = true;
        }

        if (modified) {
            this._matM.copy(this.matT).mul(this.matR).mul(this.matS);
            if (this._matM.det() !== 0) {
                this._matN.normalFromMatrix4(this._matM);
            }
            else {
                // If the scaling matrix determinant is zero, so too will be the matrix M.
                // If M is singular then it will not be possible to compute the matrix for transforming normals.
                // In any case, the geometry not be visible.
                // So we just set the normals matrix to the identity.
                this._matN.one();
            }
        }
    }
}
