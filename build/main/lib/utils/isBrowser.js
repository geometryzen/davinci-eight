"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isBrowser() {
    return typeof window === 'object' && typeof document === 'object';
}
exports.isBrowser = isBrowser;
