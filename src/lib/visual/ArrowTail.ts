import { Color } from "../core/Color";
import { ContextManager } from "../core/ContextManager";
import { Material } from "../core/Material";
import { Mesh } from "../core/Mesh";
import { referenceAxis } from "../core/referenceAxis";
import { referenceMeridian } from "../core/referenceMeridian";
import { ArrowTailGeometry, ArrowTailGeometryOptions } from "../geometries/ArrowTailGeometry";
import { SimplexMode } from "../geometries/SimplexMode";
import { normVectorE3 } from "../math/normVectorE3";
import { VectorE3 } from "../math/VectorE3";
import { ArrowOptions } from "./ArrowOptions";
import { ds } from "./Defaults";
import { materialFromOptions } from "./materialFromOptions";
import { offsetFromOptions } from "./offsetFromOptions";
import { setAxisAndMeridian } from "./setAxisAndMeridian";
import { setColorOption } from "./setColorOption";
import { setDeprecatedOptions } from "./setDeprecatedOptions";
import { simplexModeFromOptions } from "./simplexModeFromOptions";
import { spinorE3Object } from "./spinorE3Object";
import { vectorE3Object } from "./vectorE3Object";

/**
 * @hidden
 */
export class ArrowTail extends Mesh<ArrowTailGeometry, Material> {
    private readonly $heightShaft: number;
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options: Partial<Pick<ArrowOptions, "axis" | "color" | "heightShaft" | "mode" | "offset" | "radiusShaft" | "textured" | "thetaSegments" | "tilt">> = {}, levelUp = 0) {
        super(void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1);
        this.setLoggingName("Arrow");

        const geoOptions: ArrowTailGeometryOptions = {};

        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());

        this.$heightShaft = heightShaftFromOptions(options, 0.8);
        geoOptions.heightShaft = this.$heightShaft;
        geoOptions.radiusShaft = radiusShaftFromOptions(options, 0.01);
        geoOptions.thetaSegments = thetaSegmentsFromOptions(options, 16);

        const geometry = new ArrowTailGeometry(contextManager, geoOptions);
        this.geometry = geometry;
        geometry.release();

        const material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        this.material = material;
        material.release();

        setAxisAndMeridian(this, options);
        setColorOption(this, options, Color.gray);
        setDeprecatedOptions(this, options);

        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * @hidden
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }

    get vector(): VectorE3 {
        return super.getAxis().scale(this.heightShaft);
    }
    set vector(vector: VectorE3) {
        this.heightShaft = normVectorE3(vector);
        // Don't try to set the direction for the zero vector.
        if (this.heightShaft !== 0) {
            this.setAxis(vector);
        }
    }

    get heightShaft() {
        const s = this.getScaleY();
        return s * this.$heightShaft;
    }
    set heightShaft(heightShaft: number) {
        const s = heightShaft / this.$heightShaft;
        this.setScale(1, s, 1);
    }
}

/**
 * @hidden
 * @param options
 * @param defaultValue
 * @returns
 */
function heightShaftFromOptions(options: Partial<Pick<ArrowOptions, "heightShaft">>, defaultValue: number): number {
    if (options) {
        if (typeof options.heightShaft === "number") {
            return options.heightShaft;
        } else {
            return defaultValue;
        }
    } else {
        return defaultValue;
    }
}

/**
 * @hidden
 * @param options
 * @param defaultValue
 * @returns
 */
function radiusShaftFromOptions(options: Partial<Pick<ArrowOptions, "radiusShaft">>, defaultValue: number): number {
    if (options) {
        if (typeof options.radiusShaft === "number") {
            return options.radiusShaft;
        } else {
            return defaultValue;
        }
    } else {
        return defaultValue;
    }
}

/**
 * @hidden
 * @param options
 * @param defaultValue
 * @returns
 */
function thetaSegmentsFromOptions(options: Partial<Pick<ArrowOptions, "thetaSegments">>, defaultValue: number): number {
    if (options) {
        if (typeof options.thetaSegments === "number") {
            return options.thetaSegments;
        } else {
            return defaultValue;
        }
    } else {
        return defaultValue;
    }
}
