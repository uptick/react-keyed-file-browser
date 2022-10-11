export class OptionsReader {
    ownerDocument = null;
    globalContext;
    optionsArgs;
    constructor(globalContext, options) {
        this.globalContext = globalContext;
        this.optionsArgs = options;
    }
    get window() {
        if (this.globalContext) {
            return this.globalContext;
        }
        else if (typeof window !== 'undefined') {
            return window;
        }
        return undefined;
    }
    get document() {
        if (this.globalContext?.document) {
            return this.globalContext.document;
        }
        else if (this.window) {
            return this.window.document;
        }
        else {
            return undefined;
        }
    }
    get rootElement() {
        return this.optionsArgs?.rootElement || this.window;
    }
}
