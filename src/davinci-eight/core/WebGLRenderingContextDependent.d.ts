interface WebGLRenderingContextDependent
{
    onContextGain(gl: WebGLRenderingContext): void
    onContextLoss(): void
    tearDown(): void
}