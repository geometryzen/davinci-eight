"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEnums = void 0;
var BeginMode_1 = require("./BeginMode");
var BlendingFactorDest_1 = require("./BlendingFactorDest");
var BlendingFactorSrc_1 = require("./BlendingFactorSrc");
var BufferObjects_1 = require("./BufferObjects");
var Capability_1 = require("./Capability");
var ClearBufferMask_1 = require("./ClearBufferMask");
var DepthFunction_1 = require("./DepthFunction");
var PixelFormat_1 = require("./PixelFormat");
var PixelType_1 = require("./PixelType");
var Usage_1 = require("./Usage");
var mustBeEQ_1 = require("../checks/mustBeEQ");
/**
 * Verify that the enums match the values in the WebGL rendering context.
 */
function checkEnums(gl) {
    // BeginMode
    mustBeEQ_1.mustBeEQ('LINE_LOOP', BeginMode_1.BeginMode.LINE_LOOP, gl.LINE_LOOP);
    mustBeEQ_1.mustBeEQ('LINE_STRIP', BeginMode_1.BeginMode.LINE_STRIP, gl.LINE_STRIP);
    mustBeEQ_1.mustBeEQ('LINES', BeginMode_1.BeginMode.LINES, gl.LINES);
    mustBeEQ_1.mustBeEQ('POINTS', BeginMode_1.BeginMode.POINTS, gl.POINTS);
    mustBeEQ_1.mustBeEQ('TRIANGLE_FAN', BeginMode_1.BeginMode.TRIANGLE_FAN, gl.TRIANGLE_FAN);
    mustBeEQ_1.mustBeEQ('TRIANGLE_STRIP', BeginMode_1.BeginMode.TRIANGLE_STRIP, gl.TRIANGLE_STRIP);
    mustBeEQ_1.mustBeEQ('TRIANGLES', BeginMode_1.BeginMode.TRIANGLES, gl.TRIANGLES);
    // BlendingFactorDest
    mustBeEQ_1.mustBeEQ('ZERO', BlendingFactorDest_1.BlendingFactorDest.ZERO, gl.ZERO);
    mustBeEQ_1.mustBeEQ('ONE', BlendingFactorDest_1.BlendingFactorDest.ONE, gl.ONE);
    mustBeEQ_1.mustBeEQ('SRC_COLOR', BlendingFactorDest_1.BlendingFactorDest.SRC_COLOR, gl.SRC_COLOR);
    mustBeEQ_1.mustBeEQ('ONE_MINUS_SRC_COLOR', BlendingFactorDest_1.BlendingFactorDest.ONE_MINUS_SRC_COLOR, gl.ONE_MINUS_SRC_COLOR);
    mustBeEQ_1.mustBeEQ('SRC_ALPHA', BlendingFactorDest_1.BlendingFactorDest.SRC_ALPHA, gl.SRC_ALPHA);
    mustBeEQ_1.mustBeEQ('ONE_MINUS_SRC_ALPHA', BlendingFactorDest_1.BlendingFactorDest.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    mustBeEQ_1.mustBeEQ('DST_ALPHA', BlendingFactorDest_1.BlendingFactorDest.DST_ALPHA, gl.DST_ALPHA);
    mustBeEQ_1.mustBeEQ('ONE_MINUS_DST_ALPHA', BlendingFactorDest_1.BlendingFactorDest.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_DST_ALPHA);
    // BlendingFactorSrc
    mustBeEQ_1.mustBeEQ('ZERO', BlendingFactorSrc_1.BlendingFactorSrc.ZERO, gl.ZERO);
    mustBeEQ_1.mustBeEQ('ONE', BlendingFactorSrc_1.BlendingFactorSrc.ONE, gl.ONE);
    mustBeEQ_1.mustBeEQ('DST_COLOR', BlendingFactorSrc_1.BlendingFactorSrc.DST_COLOR, gl.DST_COLOR);
    mustBeEQ_1.mustBeEQ('ONE_MINUS_DST_COLOR', BlendingFactorSrc_1.BlendingFactorSrc.ONE_MINUS_DST_COLOR, gl.ONE_MINUS_DST_COLOR);
    mustBeEQ_1.mustBeEQ('SRC_ALPHA_SATURATE', BlendingFactorSrc_1.BlendingFactorSrc.SRC_ALPHA_SATURATE, gl.SRC_ALPHA_SATURATE);
    mustBeEQ_1.mustBeEQ('SRC_ALPHA', BlendingFactorSrc_1.BlendingFactorSrc.SRC_ALPHA, gl.SRC_ALPHA);
    mustBeEQ_1.mustBeEQ('ONE_MINUS_SRC_ALPHA', BlendingFactorSrc_1.BlendingFactorSrc.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    mustBeEQ_1.mustBeEQ('DST_ALPHA', BlendingFactorSrc_1.BlendingFactorSrc.DST_ALPHA, gl.DST_ALPHA);
    mustBeEQ_1.mustBeEQ('ONE_MINUS_DST_ALPHA', BlendingFactorSrc_1.BlendingFactorSrc.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_DST_ALPHA);
    // BufferObjects
    mustBeEQ_1.mustBeEQ('ARRAY_BUFFER', BufferObjects_1.BufferObjects.ARRAY_BUFFER, gl.ARRAY_BUFFER);
    mustBeEQ_1.mustBeEQ('ARRAY_BUFFER_BINDING', BufferObjects_1.BufferObjects.ARRAY_BUFFER_BINDING, gl.ARRAY_BUFFER_BINDING);
    mustBeEQ_1.mustBeEQ('ELEMENT_ARRAY_BUFFER', BufferObjects_1.BufferObjects.ELEMENT_ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER);
    mustBeEQ_1.mustBeEQ('ELEMENT_ARRAY_BUFFER_BINDING', BufferObjects_1.BufferObjects.ELEMENT_ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING);
    // Capability
    mustBeEQ_1.mustBeEQ('CULL_FACE', Capability_1.Capability.CULL_FACE, gl.CULL_FACE);
    mustBeEQ_1.mustBeEQ('BLEND', Capability_1.Capability.BLEND, gl.BLEND);
    mustBeEQ_1.mustBeEQ('DITHER', Capability_1.Capability.DITHER, gl.DITHER);
    mustBeEQ_1.mustBeEQ('STENCIL_TEST', Capability_1.Capability.STENCIL_TEST, gl.STENCIL_TEST);
    mustBeEQ_1.mustBeEQ('DEPTH_TEST', Capability_1.Capability.DEPTH_TEST, gl.DEPTH_TEST);
    mustBeEQ_1.mustBeEQ('SCISSOR_TEST', Capability_1.Capability.SCISSOR_TEST, gl.SCISSOR_TEST);
    mustBeEQ_1.mustBeEQ('POLYGON_OFFSET_FILL', Capability_1.Capability.POLYGON_OFFSET_FILL, gl.POLYGON_OFFSET_FILL);
    mustBeEQ_1.mustBeEQ('SAMPLE_ALPHA_TO_COVERAGE', Capability_1.Capability.SAMPLE_ALPHA_TO_COVERAGE, gl.SAMPLE_ALPHA_TO_COVERAGE);
    mustBeEQ_1.mustBeEQ('SAMPLE_COVERAGE', Capability_1.Capability.SAMPLE_COVERAGE, gl.SAMPLE_COVERAGE);
    // ClearBufferMask
    mustBeEQ_1.mustBeEQ('COLOR_BUFFER_BIT', ClearBufferMask_1.ClearBufferMask.COLOR_BUFFER_BIT, gl.COLOR_BUFFER_BIT);
    mustBeEQ_1.mustBeEQ('DEPTH_BUFFER_BIT', ClearBufferMask_1.ClearBufferMask.DEPTH_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);
    mustBeEQ_1.mustBeEQ('STENCIL_BUFFER_BIT', ClearBufferMask_1.ClearBufferMask.STENCIL_BUFFER_BIT, gl.STENCIL_BUFFER_BIT);
    // DepthFunction
    mustBeEQ_1.mustBeEQ('ALWAYS', DepthFunction_1.DepthFunction.ALWAYS, gl.ALWAYS);
    mustBeEQ_1.mustBeEQ('EQUAL', DepthFunction_1.DepthFunction.EQUAL, gl.EQUAL);
    mustBeEQ_1.mustBeEQ('GEQUAL', DepthFunction_1.DepthFunction.GEQUAL, gl.GEQUAL);
    mustBeEQ_1.mustBeEQ('GREATER', DepthFunction_1.DepthFunction.GREATER, gl.GREATER);
    mustBeEQ_1.mustBeEQ('LEQUAL', DepthFunction_1.DepthFunction.LEQUAL, gl.LEQUAL);
    mustBeEQ_1.mustBeEQ('LESS', DepthFunction_1.DepthFunction.LESS, gl.LESS);
    mustBeEQ_1.mustBeEQ('NEVER', DepthFunction_1.DepthFunction.NEVER, gl.NEVER);
    mustBeEQ_1.mustBeEQ('NOTEQUAL', DepthFunction_1.DepthFunction.NOTEQUAL, gl.NOTEQUAL);
    // PixelFormat
    mustBeEQ_1.mustBeEQ('DEPTH_COMPONENT', PixelFormat_1.PixelFormat.DEPTH_COMPONENT, gl.DEPTH_COMPONENT);
    mustBeEQ_1.mustBeEQ('ALPHA', PixelFormat_1.PixelFormat.ALPHA, gl.ALPHA);
    mustBeEQ_1.mustBeEQ('RGB', PixelFormat_1.PixelFormat.RGB, gl.RGB);
    mustBeEQ_1.mustBeEQ('RGBA', PixelFormat_1.PixelFormat.RGBA, gl.RGBA);
    mustBeEQ_1.mustBeEQ('LUMINANCE', PixelFormat_1.PixelFormat.LUMINANCE, gl.LUMINANCE);
    mustBeEQ_1.mustBeEQ('LUMINANCE_ALPHA', PixelFormat_1.PixelFormat.LUMINANCE_ALPHA, gl.LUMINANCE_ALPHA);
    // PixelType
    mustBeEQ_1.mustBeEQ('UNSIGNED_BYTE', PixelType_1.PixelType.UNSIGNED_BYTE, gl.UNSIGNED_BYTE);
    mustBeEQ_1.mustBeEQ('UNSIGNED_SHORT_4_4_4_4', PixelType_1.PixelType.UNSIGNED_SHORT_4_4_4_4, gl.UNSIGNED_SHORT_4_4_4_4);
    mustBeEQ_1.mustBeEQ('UNSIGNED_SHORT_5_5_5_1', PixelType_1.PixelType.UNSIGNED_SHORT_5_5_5_1, gl.UNSIGNED_SHORT_5_5_5_1);
    mustBeEQ_1.mustBeEQ('UNSIGNED_SHORT_5_6_5', PixelType_1.PixelType.UNSIGNED_SHORT_5_6_5, gl.UNSIGNED_SHORT_5_6_5);
    // Usage
    mustBeEQ_1.mustBeEQ('STREAM_DRAW', Usage_1.Usage.STREAM_DRAW, gl.STREAM_DRAW);
    mustBeEQ_1.mustBeEQ('STATIC_DRAW', Usage_1.Usage.STATIC_DRAW, gl.STATIC_DRAW);
    mustBeEQ_1.mustBeEQ('DYNAMIC_DRAW', Usage_1.Usage.DYNAMIC_DRAW, gl.DYNAMIC_DRAW);
    return gl;
}
exports.checkEnums = checkEnums;
