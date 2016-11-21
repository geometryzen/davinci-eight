import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import simplicesToGeometryMeta from './simplicesToGeometryMeta';
import simplicesToPrimitive from './simplicesToPrimitive';
import cube from './cube';

const SQUARES_PER_CUBE = 6;
const TRIANGLES_PER_SQUARE = 2;
const VERTICES_PER_SQUARE = 4;
const VERTICES_PER_TRIANGLE = 3;
const POSITION_COORDS_PER_VERTEX = 3;
const NORMAL_COORDS_PER_VERTEX = 3;
const TEX_COORDS_PER_VERTEX = 2;

describe("cube", function () {
    describe("everyting", function () {
        const simplices = cube(2); // Simplex[]
        const geometryMeta = simplicesToGeometryMeta(simplices);
        const geometryData = simplicesToPrimitive(simplices, geometryMeta);
        const indices = geometryData.indices;
        const positions = geometryData.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION].values;
        const normals = geometryData.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL].values;
        const coords = geometryData.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS].values;
        it("indices.length", function () {
            expect(indices.length).toBe(SQUARES_PER_CUBE * TRIANGLES_PER_SQUARE * VERTICES_PER_TRIANGLE);
            expect(indices.length).toBe(simplices.length * VERTICES_PER_TRIANGLE);
            expect(indices.length).toBe(36);
        });
        it("indices[0]", function () {
            expect(indices[0]).toBe(0);
        });
        it("indices[1]", function () {
            expect(indices[1]).toBe(1);
        });
        it("indices[2]", function () {
            expect(indices[2]).toBe(2);
        });
        it("indices[3]", function () {
            expect(indices[3]).toBe(3);
        });
        it("indices[4]", function () {
            expect(indices[4]).toBe(2);
        });
        it("indices[5]", function () {
            expect(indices[5]).toBe(1);
        });
        it("indices[6]", function () {
            expect(indices[6]).toBe(4);
        });
        it("indices[7]", function () {
            expect(indices[7]).toBe(5);
        });
        it("indices[8]", function () {
            expect(indices[8]).toBe(6);
        });
        it("indices[9]", function () {
            expect(indices[9]).toBe(7);
        });
        it("indices[10]", function () {
            expect(indices[10]).toBe(6);
        });
        it("indices[11]", function () {
            expect(indices[11]).toBe(5);
        });
        it("indices[12]", function () {
            expect(indices[12]).toBe(8);
        });
        it("indices[13]", function () {
            expect(indices[13]).toBe(9);
        });
        it("indices[14]", function () {
            expect(indices[14]).toBe(10);
        });
        it("indices[15]", function () {
            expect(indices[15]).toBe(11);
        });
        it("indices[16]", function () {
            expect(indices[16]).toBe(10);
        });
        it("indices[17]", function () {
            expect(indices[17]).toBe(9);
        });
        it("indices[18]", function () {
            expect(indices[18]).toBe(12);
        });
        it("indices[19]", function () {
            expect(indices[19]).toBe(13);
        });
        it("indices[20]", function () {
            expect(indices[20]).toBe(14);
        });
        it("indices[21]", function () {
            expect(indices[21]).toBe(15);
        });
        it("indices[22]", function () {
            expect(indices[22]).toBe(14);
        });
        it("indices[23]", function () {
            expect(indices[23]).toBe(13);
        });
        it("indices[24]", function () {
            expect(indices[24]).toBe(16);
        });
        it("indices[25]", function () {
            expect(indices[25]).toBe(17);
        });
        it("indices[26]", function () {
            expect(indices[26]).toBe(18);
        });
        it("indices[27]", function () {
            expect(indices[27]).toBe(19);
        });
        it("indices[28]", function () {
            expect(indices[28]).toBe(18);
        });
        it("indices[29]", function () {
            expect(indices[29]).toBe(17);
        });
        it("indices[30]", function () {
            expect(indices[30]).toBe(20);
        });
        it("indices[31]", function () {
            expect(indices[31]).toBe(21);
        });
        it("indices[32]", function () {
            expect(indices[32]).toBe(22);
        });
        it("indices[33]", function () {
            expect(indices[33]).toBe(23);
        });
        it("indices[34]", function () {
            expect(indices[34]).toBe(22);
        });
        it("indices[35]", function () {
            expect(indices[35]).toBe(21);
        });
        it("positions.length", function () {
            expect(positions.length).toBe(POSITION_COORDS_PER_VERTEX * VERTICES_PER_SQUARE * SQUARES_PER_CUBE);
        });
        it("normals.length", function () {
            expect(normals.length).toBe(NORMAL_COORDS_PER_VERTEX * VERTICES_PER_SQUARE * SQUARES_PER_CUBE);
        });
        it("coords.length", function () {
            expect(coords.length).toBe(TEX_COORDS_PER_VERTEX * VERTICES_PER_SQUARE * SQUARES_PER_CUBE);
        });
        it("v1 front position.x = -1", function () {
            expect(positions[0x00]).toBe(-1);
        });
        it("v1 front position.y = +1", function () {
            expect(positions[0x01]).toBe(+1);
        });
        it("v1 front position.z = +1", function () {
            expect(positions[0x02]).toBe(+1);
        });
        it("v1 front normal.x   =  0", function () {
            expect(normals[0x00]).toBe(0);
        });
        it("v1 front normal.y   =  0", function () {
            expect(normals[0x01]).toBe(0);
        });
        it("v1 front normal.z   = +1", function () {
            expect(normals[0x02]).toBe(+1);
        });
        it("v1 front coords.u   =  0", function () {
            expect(coords[0]).toBe(0);
        });
        it("v1 front coords.v   =  1", function () {
            expect(coords[1]).toBe(1);
        });
        it("v2 front position.x = -1", function () {
            expect(positions[0x03]).toBe(-1);
        });
        it("v2 front position y = -1", function () {
            expect(positions[0x04]).toBe(-1);
        });
        it("v2 front position z = +1", function () {
            expect(positions[0x05]).toBe(+1);
        });
        it("v2 front normal.x   =  0", function () {
            expect(normals[0x03]).toBe(0);
        });
        it("v2 front normal.y   =  0", function () {
            expect(normals[0x04]).toBe(0);
        });
        it("v2 front normal.z   = +1", function () {
            expect(normals[0x05]).toBe(+1);
        });
        it("v2 front coords.u   =  0", function () {
            expect(coords[2]).toBe(0);
        });
        it("v2 front coords.v   =  0", function () {
            expect(coords[3]).toBe(0);
        });
        it("v0 front position.x = +1", function () {
            expect(positions[0x06]).toBe(+1);
        });
        it("v0 front position.y = +1", function () {
            expect(positions[0x07]).toBe(+1);
        });
        it("v0 front position.z = +1", function () {
            expect(positions[0x08]).toBe(+1);
        });
        it("v0 front normal.x   =  0", function () {
            expect(normals[0x06]).toBe(0);
        });
        it("v0 front normal.y   =  0", function () {
            expect(normals[0x07]).toBe(0);
        });
        it("v0 front normal.z   = +1", function () {
            expect(normals[0x08]).toBe(+1);
        });
        it("v0 front coords.u   =  1", function () {
            expect(coords[4]).toBe(1);
        });
        it("v0 front coords.v   =  1", function () {
            expect(coords[5]).toBe(1);
        });
        it("v3 front position.x = +1", function () {
            expect(positions[0x09]).toBe(+1);
        });
        it("v3 front position.y = -1", function () {
            expect(positions[0x0A]).toBe(-1);
        });
        it("v3 front position.z = +1", function () {
            expect(positions[0x0B]).toBe(+1);
        });
        it("v3 front normal.x   =  0", function () {
            expect(normals[0x09]).toBe(0);
        });
        it("v3 front normal.x   =  0", function () {
            expect(normals[0x0A]).toBe(0);
        });
        it("v3 front normal.x   = +1", function () {
            expect(normals[0x0B]).toBe(+1);
        });
        it("v3 front coords.u   =  1", function () {
            expect(coords[6]).toBe(1);
        });
        it("v3 front coords.v   =  0", function () {
            expect(coords[7]).toBe(0);
        });
        /*
        // right
        // 1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,    // v0-v3-v4-v5 right
        it("positions v0 right", function() {
          expect(positions[0x0C]).toBe(+1);
          expect(positions[0x0D]).toBe(+1);
          expect(positions[0x0E]).toBe(+1);
  
          expect(normals[0x0C]).toBe(+1);
          expect(normals[0x0D]).toBe( 0);
          expect(normals[0x0E]).toBe( 0);
        });
        it("positions v3 right", function() {
          expect(positions[0x0F]).toBe(+1);
          expect(positions[0x10]).toBe(-1);
          expect(positions[0x11]).toBe(+1);
        });
        it("positions v4 right", function() {
          expect(positions[0x12]).toBe(+1);
          expect(positions[0x13]).toBe(-1);
          expect(positions[0x14]).toBe(-1);
        });
        it("positions v5 right", function() {
          expect(positions[0x15]).toBe(+1);
          expect(positions[0x16]).toBe(+1);
          expect(positions[0x17]).toBe(-1);
        });
        // top
        // 1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,    // v0-v5-v6-v1 top
        it("positions v0 top", function() {
          expect(positions[0x18]).toBe(+1);
          expect(positions[0x19]).toBe(+1);
          expect(positions[0x1A]).toBe(+1);
  
          expect(normals[0x18]).toBe( 0);
          expect(normals[0x19]).toBe(+1);
          expect(normals[0x1A]).toBe( 0);
        });
        it("positions v5 top", function() {
          expect(positions[0x1B]).toBe(+1);
          expect(positions[0x1C]).toBe(+1);
          expect(positions[0x1D]).toBe(-1);
        });
        it("positions v6 top", function() {
          expect(positions[0x1E]).toBe(-1);
          expect(positions[0x1F]).toBe(+1);
          expect(positions[0x20]).toBe(-1);
        });
        it("positions v1 top", function() {
          expect(positions[0x21]).toBe(-1);
          expect(positions[0x22]).toBe(+1);
          expect(positions[0x23]).toBe(+1);
        });
        // left
        // -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,    // v1-v6-v7-v2 left
        it("positions v1 left", function() {
          expect(positions[0x24]).toBe(-1);
          expect(positions[0x25]).toBe(+1);
          expect(positions[0x26]).toBe(+1);
  
          expect(normals[0x24]).toBe(-1);
          expect(normals[0x25]).toBe(0);
          expect(normals[0x26]).toBe(0);
        });
        it("positions v6 left", function() {
          expect(positions[0x27]).toBe(-1);
          expect(positions[0x28]).toBe(+1);
          expect(positions[0x29]).toBe(-1);
        });
        it("positions v7 left", function() {
          expect(positions[0x2A]).toBe(-1);
          expect(positions[0x2B]).toBe(-1);
          expect(positions[0x2C]).toBe(-1);
        });
        it("positions v2 left", function() {
          expect(positions[0x2D]).toBe(-1);
          expect(positions[0x2E]).toBe(-1);
          expect(positions[0x2F]).toBe(+1);
        });
        // bottom
        // -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,    // v7-v4-v3-v2 bottom
        it("positions v7 bottom", function() {
          expect(positions[0x30]).toBe(-1);
          expect(positions[0x31]).toBe(-1);
          expect(positions[0x32]).toBe(-1);
  
          expect(normals[0x30]).toBe(0);
          expect(normals[0x31]).toBe(-1);
          expect(normals[0x32]).toBe(0);
        });
        it("positions v4 bottom", function() {
          expect(positions[0x33]).toBe(+1);
          expect(positions[0x34]).toBe(-1);
          expect(positions[0x35]).toBe(-1);
        });
        it("positions v3 bottom", function() {
          expect(positions[0x36]).toBe(+1);
          expect(positions[0x37]).toBe(-1);
          expect(positions[0x38]).toBe(+1);
        });
        it("positions v2 bottom", function() {
          expect(positions[0x39]).toBe(-1);
          expect(positions[0x3A]).toBe(-1);
          expect(positions[0x3B]).toBe(+1);
        });
        // back
        // 1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 ]   // v4-v7-v6-v5 back
        it("v7 back", function() {
          expect(positions[0x3C]).toBe(+1);
          expect(positions[0x3D]).toBe(-1);
          expect(positions[0x3E]).toBe(-1);
  
          expect(normals[0x3C]).toBe(0);
          expect(normals[0x3D]).toBe(0);
          expect(normals[0x3E]).toBe(-1);
        });
        it("v4 back", function() {
          expect(positions[0x3F]).toBe(-1);
          expect(positions[0x40]).toBe(-1);
          expect(positions[0x41]).toBe(-1);
  
          expect(normals[0x3F]).toBe(0);
          expect(normals[0x40]).toBe(0);
          expect(normals[0x41]).toBe(-1);
        });
        it("positions v3 back", function() {
          expect(positions[0x42]).toBe(-1);
          expect(positions[0x43]).toBe(+1);
          expect(positions[0x44]).toBe(-1);
        });
        it("positions v2 back", function() {
          expect(positions[0x45]).toBe(+1);
          expect(positions[0x46]).toBe(+1);
          expect(positions[0x47]).toBe(-1);
        });
        */
    });
});
