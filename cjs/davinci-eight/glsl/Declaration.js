var Declaration = (function () {
    function Declaration(kind, modifiers, type, name) {
        this.kind = kind;
        this.modifiers = modifiers;
        this.type = type;
        this.name = name;
    }
    return Declaration;
})();
module.exports = Declaration;
