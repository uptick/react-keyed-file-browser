import { union, without } from './utils/js_utils';
export class EnterLeaveCounter {
    entered = [];
    isNodeInDocument;
    constructor(isNodeInDocument) {
        this.isNodeInDocument = isNodeInDocument;
    }
    enter(enteringNode) {
        const previousLength = this.entered.length;
        const isNodeEntered = (node) => this.isNodeInDocument(node) &&
            (!node.contains || node.contains(enteringNode));
        this.entered = union(this.entered.filter(isNodeEntered), [enteringNode]);
        return previousLength === 0 && this.entered.length > 0;
    }
    leave(leavingNode) {
        const previousLength = this.entered.length;
        this.entered = without(this.entered.filter(this.isNodeInDocument), leavingNode);
        return previousLength > 0 && this.entered.length === 0;
    }
    reset() {
        this.entered = [];
    }
}
