define(["require", "exports"], function (require, exports) {
    function computeUsage(attributes, context) {
        return attributes.dynamics() ? context.DYNAMIC_DRAW : context.STATIC_DRAW;
    }
    function existsLocation(location) {
        return location >= 0;
    }
    /**
     * Utility class for managing a shader attribute variable.
     * While this class may be created directly by the user, it is preferable
     * to use the ShaderAttributeLocation instances managed by the ShaderProgram because
     * there will be improved integrity and context loss management.
     * @class ShaderAttributeLocation.
     */
    var ShaderAttributeLocation = (function () {
        /**
         * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
         * In particular, this class manages buffer allocation, location caching, and data binding.
         * @class ShaderAttributeLocation
         * @constructor
         * @param name {string} The name of the variable as it appears in the GLSL program.
         * @param glslType {string} The type of the variable as it appears in the GLSL program.
         */
        function ShaderAttributeLocation(name, glslType) {
            this.$name = name;
            switch (glslType) {
                case 'float':
                case 'vec2':
                case 'vec3':
                case 'vec4':
                case 'mat2':
                case 'mat3':
                case 'mat4':
                    {
                        this.$glslType = glslType;
                    }
                    break;
                default: {
                    // TODO
                    throw new Error("Argument glslType in ShaderAttributeLocation constructor must be one of float, vec2, vec3, vec4, mat2, mat3, mat4. Got: " + glslType);
                }
            }
        }
        Object.defineProperty(ShaderAttributeLocation.prototype, "name", {
            get: function () {
                return this.$name;
            },
            enumerable: true,
            configurable: true
        });
        ShaderAttributeLocation.prototype.contextFree = function () {
            if (this.buffer) {
                this.context.deleteBuffer(this.buffer);
                this.contextLoss();
            }
        };
        ShaderAttributeLocation.prototype.contextGain = function (context, program) {
            this.location = context.getAttribLocation(program, this.name);
            this.context = context;
            if (existsLocation(this.location)) {
                this.buffer = context.createBuffer();
            }
        };
        ShaderAttributeLocation.prototype.contextLoss = function () {
            this.location = void 0;
            this.buffer = void 0;
            this.context = void 0;
        };
        /**
         * @method dataFormat
         * @param size {number} The number of components per attribute. Must be 1,2,3, or 4.
         * @param type {number} Specifies the data type of each component in the array. gl.FLOAT (default) or gl.FIXED.
         * @param normalized {boolean} Used for WebGLRenderingContext.vertexAttribPointer().
         * @param stride {number} Used for WebGLRenderingContext.vertexAttribPointer().
         * @param offset {number} Used for WebGLRenderingContext.vertexAttribPointer().
         */
        ShaderAttributeLocation.prototype.dataFormat = function (size, type, normalized, stride, offset) {
            if (normalized === void 0) { normalized = false; }
            if (stride === void 0) { stride = 0; }
            if (offset === void 0) { offset = 0; }
            if (existsLocation(this.location)) {
                // TODO: We could assert that we have a buffer.
                this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
                // 6.14 Fixed point support.
                // The WebGL API does not support the GL_FIXED data type.
                // Consequently, we hard-code the FLOAT constant.
                this.context.vertexAttribPointer(this.location, size, type, normalized, stride, offset);
            }
        };
        /**
         * FIXME This should not couple to an AttributeProvider.
         * @method bufferData
         */
        ShaderAttributeLocation.prototype.bufferData = function (attributes) {
            if (existsLocation(this.location)) {
                var data = attributes.getVertexAttributeData(this.name);
                if (data) {
                    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
                    this.context.bufferData(this.context.ARRAY_BUFFER, data, computeUsage(attributes, this.context));
                }
                else {
                    // We expect this to be detected long before we get here.
                    throw new Error("Geometry implementation claims to support but does not provide data for attribute " + this.name);
                }
            }
        };
        ShaderAttributeLocation.prototype.enable = function () {
            if (existsLocation(this.location)) {
                this.context.enableVertexAttribArray(this.location);
            }
        };
        ShaderAttributeLocation.prototype.disable = function () {
            if (existsLocation(this.location)) {
                this.context.disableVertexAttribArray(this.location);
            }
        };
        /**
         * @method toString
         */
        ShaderAttributeLocation.prototype.toString = function () {
            return ["ShaderAttributeLocation({name: ", this.name, ", glslType: ", this.$glslType + "})"].join('');
        };
        return ShaderAttributeLocation;
    })();
    return ShaderAttributeLocation;
});
