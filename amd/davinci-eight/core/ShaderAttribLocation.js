define(["require", "exports", '../core/convertUsage', '../checks/expectArg'], function (require, exports, convertUsage, expectArg) {
    function existsLocation(location) {
        return location >= 0;
    }
    /**
     * Utility class for managing a shader attribute variable.
     * While this class may be created directly by the user, it is preferable
     * to use the ShaderAttribLocation instances managed by the ShaderProgram because
     * there will be improved integrity and context loss management.
     * @class ShaderAttribLocation.
     */
    var ShaderAttribLocation = (function () {
        /**
         * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
         * In particular, this class manages buffer allocation, location caching, and data binding.
         * @class ShaderAttribLocation
         * @constructor
         * @param name {string} The name of the variable as it appears in the GLSL program.
         * @param glslType {string} The type of the variable as it appears in the GLSL program.
         */
        function ShaderAttribLocation(name, glslType) {
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
                    throw new Error("Argument glslType in ShaderAttribLocation constructor must be one of float, vec2, vec3, vec4, mat2, mat3, mat4. Got: " + glslType);
                }
            }
        }
        Object.defineProperty(ShaderAttribLocation.prototype, "name", {
            get: function () {
                return this.$name;
            },
            enumerable: true,
            configurable: true
        });
        ShaderAttribLocation.prototype.contextFree = function () {
            if (this.buffer) {
                this.context.deleteBuffer(this.buffer);
                this.contextLoss();
            }
        };
        ShaderAttribLocation.prototype.contextGain = function (context, program) {
            expectArg('context', context).toBeObject();
            expectArg('program', program).toBeObject();
            this.location = context.getAttribLocation(program, this.name);
            this.context = context;
            if (existsLocation(this.location)) {
                this.buffer = context.createBuffer();
            }
        };
        ShaderAttribLocation.prototype.contextLoss = function () {
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
        ShaderAttribLocation.prototype.dataFormat = function (size, type, normalized, stride, offset) {
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
         * FIXME This should not couple to an AttribProvider.
         * @method bufferData
         */
        ShaderAttribLocation.prototype.bufferData = function (data, usage) {
            if (existsLocation(this.location)) {
                this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
                this.context.bufferData(this.context.ARRAY_BUFFER, data, convertUsage(usage, this.context));
            }
        };
        /*
        bufferData(attributes: AttribProvider) {
          if (existsLocation(this.location)) {
            let thing = attributes.getAttribArray(this.name);
            if (thing) {
              this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
              this.context.bufferData(this.context.ARRAY_BUFFER, thing.data, convertUsage(thing.usage, this.context));
            }
            else {
              // We expect this to be detected long before we get here.
              throw new Error("Geometry implementation claims to support but does not provide data for attribute " + this.name);
            }
          }
        }
        */
        ShaderAttribLocation.prototype.enable = function () {
            if (existsLocation(this.location)) {
                this.context.enableVertexAttribArray(this.location);
            }
        };
        ShaderAttribLocation.prototype.disable = function () {
            if (existsLocation(this.location)) {
                this.context.disableVertexAttribArray(this.location);
            }
        };
        /**
         * @method toString
         */
        ShaderAttribLocation.prototype.toString = function () {
            return ["ShaderAttribLocation({name: ", this.name, ", glslType: ", this.$glslType + "})"].join('');
        };
        return ShaderAttribLocation;
    })();
    return ShaderAttribLocation;
});
