import tokenizeString from './tokenizeString'

describe("glsl/tokenizeString", function() {
    it("main", function() {
        var tokens = tokenizeString('void main(void) {}');

        expect(tokens.length).toBe(9);

        expect(tokens[0].data).toBe("void");
        expect(tokens[0].type).toBe('keyword');

        expect(tokens[1].data).toBe(" ");
        expect(tokens[1].type).toBe('whitespace');

        expect(tokens[2].data).toBe("main");
        expect(tokens[2].type).toBe('ident');

        expect(tokens[3].data).toBe("(");
        expect(tokens[3].type).toBe('operator');

        expect(tokens[4].data).toBe("void");
        expect(tokens[4].type).toBe('keyword');

        expect(tokens[5].data).toBe(")");
        expect(tokens[5].type).toBe('operator');

        expect(tokens[6].data).toBe(" ");
        expect(tokens[6].type).toBe('whitespace');

        expect(tokens[7].data).toBe("{}");
        expect(tokens[7].type).toBe('operator');

        expect(tokens[8].data).toBe("(eof)");
        expect(tokens[8].type).toBe('eof');
    });

    it("attribute", function() {
        var tokens = tokenizeString('attribute vec3 aVertexPosition;');

        expect(tokens.length).toBe(7);

        expect(tokens[0].data).toBe("attribute");
        expect(tokens[0].type).toBe('keyword');

        expect(tokens[1].data).toBe(" ");
        expect(tokens[1].type).toBe('whitespace');

        expect(tokens[2].data).toBe("vec3");
        expect(tokens[2].type).toBe('keyword');

        expect(tokens[3].data).toBe(" ");
        expect(tokens[3].type).toBe('whitespace');

        expect(tokens[4].data).toBe("aVertexPosition");
        expect(tokens[4].type).toBe('ident');

        expect(tokens[5].data).toBe(";");
        expect(tokens[5].type).toBe('operator');

        expect(tokens[6].data).toBe("(eof)");
        expect(tokens[6].type).toBe('eof');
    });

    it("gl_Position", function() {
        var tokens = tokenizeString('void main(void) {gl_Position = aVertexPosition}');

        expect(tokens.length).toBe(15);

        expect(tokens[0].data).toBe("void");
        expect(tokens[0].type).toBe('keyword');

        expect(tokens[1].data).toBe(" ");
        expect(tokens[1].type).toBe('whitespace');

        expect(tokens[2].data).toBe("main");
        expect(tokens[2].type).toBe('ident');

        expect(tokens[3].data).toBe("(");
        expect(tokens[3].type).toBe('operator');

        expect(tokens[4].data).toBe("void");
        expect(tokens[4].type).toBe('keyword');

        expect(tokens[5].data).toBe(")");
        expect(tokens[5].type).toBe('operator');

        expect(tokens[6].data).toBe(" ");
        expect(tokens[6].type).toBe('whitespace');

        expect(tokens[7].data).toBe("{");
        expect(tokens[7].type).toBe('operator');

        expect(tokens[8].data).toBe("gl_Position");
        expect(tokens[8].type).toBe('builtin');

        expect(tokens[9].data).toBe(" ");
        expect(tokens[9].type).toBe('whitespace');

        expect(tokens[10].data).toBe("=");
        expect(tokens[10].type).toBe('operator');

        expect(tokens[11].data).toBe(" ");
        expect(tokens[11].type).toBe('whitespace');

        expect(tokens[12].data).toBe("aVertexPosition");
        expect(tokens[12].type).toBe('ident');

        expect(tokens[13].data).toBe("}");
        expect(tokens[13].type).toBe('operator');

        expect(tokens[14].data).toBe("(eof)");
        expect(tokens[14].type).toBe('eof');
    });
});
