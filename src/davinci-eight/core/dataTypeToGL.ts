import DataType from './DataType';
import isUndefined from '../checks/isUndefined';

export default function(dataType: DataType, gl: WebGLRenderingContext): number {
    switch (dataType) {
        case DataType.BYTE: return gl.BYTE;
        case DataType.UNSIGNED_BYTE: return gl.UNSIGNED_BYTE;
        case DataType.SHORT: return gl.SHORT;
        case DataType.UNSIGNED_SHORT: return gl.UNSIGNED_SHORT;
        case DataType.INT: return gl.INT;
        case DataType.UNSIGNED_INT: return gl.UNSIGNED_INT;
        case DataType.FLOAT: return gl.FLOAT;
        default:
            if (isUndefined(dataType)) {
                console.warn("dataType argument is undefined. Assuming FLOAT.");
                return gl.FLOAT;
            }
            else {
                throw new Error(`Unexpected dataType: ${dataType}`);
            }
    }
}
