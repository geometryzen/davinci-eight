import { BeginMode } from './BeginMode';
import { BlendingFactorDest } from './BlendingFactorDest';
import { BlendingFactorSrc } from './BlendingFactorSrc';
import { BufferObjects } from './BufferObjects';
import { Capability } from './Capability';
import { ClearBufferMask } from './ClearBufferMask';
import { DepthFunction } from './DepthFunction';
import { PixelFormat } from './PixelFormat';
import { PixelType } from './PixelType';
import { Usage } from './Usage';
import { mustBeEQ } from '../checks/mustBeEQ';
/**
 * Verify that the enums match the values in the WebGL rendering context.
 */
export function checkEnums(gl) {
    // BeginMode
    mustBeEQ('LINE_LOOP', BeginMode.LINE_LOOP, gl.LINE_LOOP);
    mustBeEQ('LINE_STRIP', BeginMode.LINE_STRIP, gl.LINE_STRIP);
    mustBeEQ('LINES', BeginMode.LINES, gl.LINES);
    mustBeEQ('POINTS', BeginMode.POINTS, gl.POINTS);
    mustBeEQ('TRIANGLE_FAN', BeginMode.TRIANGLE_FAN, gl.TRIANGLE_FAN);
    mustBeEQ('TRIANGLE_STRIP', BeginMode.TRIANGLE_STRIP, gl.TRIANGLE_STRIP);
    mustBeEQ('TRIANGLES', BeginMode.TRIANGLES, gl.TRIANGLES);
    // BlendingFactorDest
    mustBeEQ('ZERO', BlendingFactorDest.ZERO, gl.ZERO);
    mustBeEQ('ONE', BlendingFactorDest.ONE, gl.ONE);
    mustBeEQ('SRC_COLOR', BlendingFactorDest.SRC_COLOR, gl.SRC_COLOR);
    mustBeEQ('ONE_MINUS_SRC_COLOR', BlendingFactorDest.ONE_MINUS_SRC_COLOR, gl.ONE_MINUS_SRC_COLOR);
    mustBeEQ('SRC_ALPHA', BlendingFactorDest.SRC_ALPHA, gl.SRC_ALPHA);
    mustBeEQ('ONE_MINUS_SRC_ALPHA', BlendingFactorDest.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    mustBeEQ('DST_ALPHA', BlendingFactorDest.DST_ALPHA, gl.DST_ALPHA);
    mustBeEQ('ONE_MINUS_DST_ALPHA', BlendingFactorDest.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_DST_ALPHA);
    // BlendingFactorSrc
    mustBeEQ('ZERO', BlendingFactorSrc.ZERO, gl.ZERO);
    mustBeEQ('ONE', BlendingFactorSrc.ONE, gl.ONE);
    mustBeEQ('DST_COLOR', BlendingFactorSrc.DST_COLOR, gl.DST_COLOR);
    mustBeEQ('ONE_MINUS_DST_COLOR', BlendingFactorSrc.ONE_MINUS_DST_COLOR, gl.ONE_MINUS_DST_COLOR);
    mustBeEQ('SRC_ALPHA_SATURATE', BlendingFactorSrc.SRC_ALPHA_SATURATE, gl.SRC_ALPHA_SATURATE);
    mustBeEQ('SRC_ALPHA', BlendingFactorSrc.SRC_ALPHA, gl.SRC_ALPHA);
    mustBeEQ('ONE_MINUS_SRC_ALPHA', BlendingFactorSrc.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    mustBeEQ('DST_ALPHA', BlendingFactorSrc.DST_ALPHA, gl.DST_ALPHA);
    mustBeEQ('ONE_MINUS_DST_ALPHA', BlendingFactorSrc.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_DST_ALPHA);
    // BufferObjects
    mustBeEQ('ARRAY_BUFFER', BufferObjects.ARRAY_BUFFER, gl.ARRAY_BUFFER);
    mustBeEQ('ARRAY_BUFFER_BINDING', BufferObjects.ARRAY_BUFFER_BINDING, gl.ARRAY_BUFFER_BINDING);
    mustBeEQ('ELEMENT_ARRAY_BUFFER', BufferObjects.ELEMENT_ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER);
    mustBeEQ('ELEMENT_ARRAY_BUFFER_BINDING', BufferObjects.ELEMENT_ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING);
    // Capability
    mustBeEQ('CULL_FACE', Capability.CULL_FACE, gl.CULL_FACE);
    mustBeEQ('BLEND', Capability.BLEND, gl.BLEND);
    mustBeEQ('DITHER', Capability.DITHER, gl.DITHER);
    mustBeEQ('STENCIL_TEST', Capability.STENCIL_TEST, gl.STENCIL_TEST);
    mustBeEQ('DEPTH_TEST', Capability.DEPTH_TEST, gl.DEPTH_TEST);
    mustBeEQ('SCISSOR_TEST', Capability.SCISSOR_TEST, gl.SCISSOR_TEST);
    mustBeEQ('POLYGON_OFFSET_FILL', Capability.POLYGON_OFFSET_FILL, gl.POLYGON_OFFSET_FILL);
    mustBeEQ('SAMPLE_ALPHA_TO_COVERAGE', Capability.SAMPLE_ALPHA_TO_COVERAGE, gl.SAMPLE_ALPHA_TO_COVERAGE);
    mustBeEQ('SAMPLE_COVERAGE', Capability.SAMPLE_COVERAGE, gl.SAMPLE_COVERAGE);
    // ClearBufferMask
    mustBeEQ('COLOR_BUFFER_BIT', ClearBufferMask.COLOR_BUFFER_BIT, gl.COLOR_BUFFER_BIT);
    mustBeEQ('DEPTH_BUFFER_BIT', ClearBufferMask.DEPTH_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);
    mustBeEQ('STENCIL_BUFFER_BIT', ClearBufferMask.STENCIL_BUFFER_BIT, gl.STENCIL_BUFFER_BIT);
    // DepthFunction
    mustBeEQ('ALWAYS', DepthFunction.ALWAYS, gl.ALWAYS);
    mustBeEQ('EQUAL', DepthFunction.EQUAL, gl.EQUAL);
    mustBeEQ('GEQUAL', DepthFunction.GEQUAL, gl.GEQUAL);
    mustBeEQ('GREATER', DepthFunction.GREATER, gl.GREATER);
    mustBeEQ('LEQUAL', DepthFunction.LEQUAL, gl.LEQUAL);
    mustBeEQ('LESS', DepthFunction.LESS, gl.LESS);
    mustBeEQ('NEVER', DepthFunction.NEVER, gl.NEVER);
    mustBeEQ('NOTEQUAL', DepthFunction.NOTEQUAL, gl.NOTEQUAL);
    // PixelFormat
    mustBeEQ('DEPTH_COMPONENT', PixelFormat.DEPTH_COMPONENT, gl.DEPTH_COMPONENT);
    mustBeEQ('ALPHA', PixelFormat.ALPHA, gl.ALPHA);
    mustBeEQ('RGB', PixelFormat.RGB, gl.RGB);
    mustBeEQ('RGBA', PixelFormat.RGBA, gl.RGBA);
    mustBeEQ('LUMINANCE', PixelFormat.LUMINANCE, gl.LUMINANCE);
    mustBeEQ('LUMINANCE_ALPHA', PixelFormat.LUMINANCE_ALPHA, gl.LUMINANCE_ALPHA);
    // PixelType
    mustBeEQ('UNSIGNED_BYTE', PixelType.UNSIGNED_BYTE, gl.UNSIGNED_BYTE);
    mustBeEQ('UNSIGNED_SHORT_4_4_4_4', PixelType.UNSIGNED_SHORT_4_4_4_4, gl.UNSIGNED_SHORT_4_4_4_4);
    mustBeEQ('UNSIGNED_SHORT_5_5_5_1', PixelType.UNSIGNED_SHORT_5_5_5_1, gl.UNSIGNED_SHORT_5_5_5_1);
    mustBeEQ('UNSIGNED_SHORT_5_6_5', PixelType.UNSIGNED_SHORT_5_6_5, gl.UNSIGNED_SHORT_5_6_5);
    // Usage
    mustBeEQ('STREAM_DRAW', Usage.STREAM_DRAW, gl.STREAM_DRAW);
    mustBeEQ('STATIC_DRAW', Usage.STATIC_DRAW, gl.STATIC_DRAW);
    mustBeEQ('DYNAMIC_DRAW', Usage.DYNAMIC_DRAW, gl.DYNAMIC_DRAW);
    return gl;
}
