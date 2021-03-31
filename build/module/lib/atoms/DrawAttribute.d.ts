import { Attribute } from '../core/Attribute';
import { AttributeSizeType } from '../core/AttributeSizeType';
import { DataType } from '../core/DataType';
/**
 * A convenience class for implementing the Attribute interface.
 * @hidden
 */
export declare class DrawAttribute implements Attribute {
    readonly values: number[];
    readonly size: AttributeSizeType;
    readonly type: DataType;
    constructor(values: number[], size: AttributeSizeType, type: DataType);
}
