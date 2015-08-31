define(["require", "exports"], function (require, exports) {
    function glslType(type, context) {
        switch (type) {
            case 2: {
                return "foo";
            }
            case context.FLOAT_VEC3: {
                return 'vec3';
            }
            case context.FLOAT_MAT2: {
                return 'mat2';
            }
            case context.FLOAT_MAT3: {
                return 'mat3';
            }
            case context.FLOAT_MAT4: {
                return 'mat4';
            }
            default: {
                throw new Error("Unexpected type: " + type);
            }
        }
    }
    return glslType;
});
