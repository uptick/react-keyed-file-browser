import { EnterLeaveCounter } from './EnterLeaveCounter';
import { getNodeClientOffset, getEventClientOffset, getDragPreviewOffset, } from './OffsetUtils';
import { createNativeDragSource, matchNativeItemType, } from './NativeDragSources';
import * as NativeTypes from './NativeTypes';
import { OptionsReader } from './OptionsReader';
export class HTML5BackendImpl {
    options;
    // React-Dnd Components
    actions;
    monitor;
    registry;
    // Internal State
    enterLeaveCounter;
    sourcePreviewNodes = new Map();
    sourcePreviewNodeOptions = new Map();
    sourceNodes = new Map();
    sourceNodeOptions = new Map();
    dragStartSourceIds = null;
    dropTargetIds = [];
    dragEnterTargetIds = [];
    currentNativeSource = null;
    currentNativeHandle = null;
    currentDragSourceNode = null;
    altKeyPressed = false;
    mouseMoveTimeoutTimer = null;
    asyncEndDragFrameId = null;
    dragOverTargetIds = null;
    lastClientOffset = null;
    hoverRafId = null;
    constructor(manager, globalContext, options) {
        this.options = new OptionsReader(globalContext, options);
        this.actions = manager.getActions();
        this.monitor = manager.getMonitor();
        this.registry = manager.getRegistry();
        this.enterLeaveCounter = new EnterLeaveCounter(this.isNodeInDocument);
    }
    /**
     * Generate profiling statistics for the HTML5Backend.
     */
    profile() {
        return {
            sourcePreviewNodes: this.sourcePreviewNodes.size,
            sourcePreviewNodeOptions: this.sourcePreviewNodeOptions.size,
            sourceNodeOptions: this.sourceNodeOptions.size,
            sourceNodes: this.sourceNodes.size,
            dragStartSourceIds: this.dragStartSourceIds?.length || 0,
            dropTargetIds: this.dropTargetIds.length,
            dragEnterTargetIds: this.dragEnterTargetIds.length,
            dragOverTargetIds: this.dragOverTargetIds?.length || 0,
        };
    }
    // public for test
    get window() {
        return this.options.window;
    }
    get document() {
        return this.options.document;
    }
    /**
     * Get the root element to use for event subscriptions
     */
    get rootElement() {
        return this.options.rootElement;
    }
    setup() {
        const root = this.rootElement;
        if (root === undefined) {
            return;
        }
        if (root.__isReactDndBackendSetUp) {
            throw new Error('Cannot have two HTML5 backends at the same time.');
        }
        root.__isReactDndBackendSetUp = true;
        this.addEventListeners(root);
    }
    teardown() {
        const root = this.rootElement;
        if (root === undefined) {
            return;
        }
        root.__isReactDndBackendSetUp = false;
        this.removeEventListeners(this.rootElement);
        this.clearCurrentDragSourceNode();
        if (this.asyncEndDragFrameId) {
            this.window?.cancelAnimationFrame(this.asyncEndDragFrameId);
        }
    }
    connectDragPreview(sourceId, node, options) {
        this.sourcePreviewNodeOptions.set(sourceId, options);
        this.sourcePreviewNodes.set(sourceId, node);
        return () => {
            this.sourcePreviewNodes.delete(sourceId);
            this.sourcePreviewNodeOptions.delete(sourceId);
        };
    }
    connectDragSource(sourceId, node, options) {
        this.sourceNodes.set(sourceId, node);
        this.sourceNodeOptions.set(sourceId, options);
        const handleDragStart = (e) => this.handleDragStart(e, sourceId);
        const handleSelectStart = (e) => this.handleSelectStart(e);
        node.setAttribute('draggable', 'true');
        node.addEventListener('dragstart', handleDragStart);
        node.addEventListener('selectstart', handleSelectStart);
        return () => {
            this.sourceNodes.delete(sourceId);
            this.sourceNodeOptions.delete(sourceId);
            node.removeEventListener('dragstart', handleDragStart);
            node.removeEventListener('selectstart', handleSelectStart);
            node.setAttribute('draggable', 'false');
        };
    }
    connectDropTarget(targetId, node) {
        const handleDragEnter = (e) => this.handleDragEnter(e, targetId);
        const handleDragOver = (e) => this.handleDragOver(e, targetId);
        const handleDrop = (e) => this.handleDrop(e, targetId);
        node.addEventListener('dragenter', handleDragEnter);
        node.addEventListener('dragover', handleDragOver);
        node.addEventListener('drop', handleDrop);
        return () => {
            node.removeEventListener('dragenter', handleDragEnter);
            node.removeEventListener('dragover', handleDragOver);
            node.removeEventListener('drop', handleDrop);
        };
    }
    addEventListeners(target) {
        // SSR Fix (https://github.com/react-dnd/react-dnd/pull/813
        if (!target.addEventListener) {
            return;
        }
        target.addEventListener('dragstart', this.handleTopDragStart);
        target.addEventListener('dragstart', this.handleTopDragStartCapture, true);
        target.addEventListener('dragend', this.handleTopDragEndCapture, true);
        target.addEventListener('dragenter', this.handleTopDragEnter);
        target.addEventListener('dragenter', this.handleTopDragEnterCapture, true);
        target.addEventListener('dragleave', this.handleTopDragLeaveCapture, true);
        target.addEventListener('dragover', this.handleTopDragOver);
        target.addEventListener('dragover', this.handleTopDragOverCapture, true);
        target.addEventListener('drop', this.handleTopDrop);
        target.addEventListener('drop', this.handleTopDropCapture, true);
    }
    removeEventListeners(target) {
        // SSR Fix (https://github.com/react-dnd/react-dnd/pull/813
        if (!target.removeEventListener) {
            return;
        }
        target.removeEventListener('dragstart', this.handleTopDragStart);
        target.removeEventListener('dragstart', this.handleTopDragStartCapture, true);
        target.removeEventListener('dragend', this.handleTopDragEndCapture, true);
        target.removeEventListener('dragenter', this.handleTopDragEnter);
        target.removeEventListener('dragenter', this.handleTopDragEnterCapture, true);
        target.removeEventListener('dragleave', this.handleTopDragLeaveCapture, true);
        target.removeEventListener('dragover', this.handleTopDragOver);
        target.removeEventListener('dragover', this.handleTopDragOverCapture, true);
        target.removeEventListener('drop', this.handleTopDrop);
        target.removeEventListener('drop', this.handleTopDropCapture, true);
    }
    getCurrentSourceNodeOptions() {
        const sourceId = this.monitor.getSourceId();
        const sourceNodeOptions = this.sourceNodeOptions.get(sourceId);
        return {
            dropEffect: this.altKeyPressed ? 'copy' : 'move',
            ...(sourceNodeOptions || {}),
        };
    }
    getCurrentDropEffect() {
        if (this.isDraggingNativeItem()) {
            // It makes more sense to default to 'copy' for native resources
            return 'copy';
        }
        return this.getCurrentSourceNodeOptions().dropEffect;
    }
    getCurrentSourcePreviewNodeOptions() {
        const sourceId = this.monitor.getSourceId();
        const sourcePreviewNodeOptions = this.sourcePreviewNodeOptions.get(sourceId);
        return {
            anchorX: 0.5,
            anchorY: 0.5,
            captureDraggingState: false,
            ...(sourcePreviewNodeOptions || {}),
        };
    }
    getSourceClientOffset = (sourceId) => {
        const source = this.sourceNodes.get(sourceId);
        return (source && getNodeClientOffset(source)) || null;
    };
    isDraggingNativeItem() {
        const itemType = this.monitor.getItemType();
        return Object.keys(NativeTypes).some((key) => NativeTypes[key] === itemType);
    }
    beginDragNativeItem(type, dataTransfer) {
        this.clearCurrentDragSourceNode();
        this.currentNativeSource = createNativeDragSource(type, dataTransfer);
        this.currentNativeHandle = this.registry.addSource(type, this.currentNativeSource);
        this.actions.beginDrag([this.currentNativeHandle]);
    }
    endDragNativeItem = () => {
        if (!this.isDraggingNativeItem()) {
            return;
        }
        this.actions.endDrag();
        if (this.currentNativeHandle) {
            this.registry.removeSource(this.currentNativeHandle);
        }
        this.currentNativeHandle = null;
        this.currentNativeSource = null;
    };
    isNodeInDocument = (node) => {
        // Check the node either in the main document or in the current context
        return Boolean(node &&
            this.document &&
            this.document.body &&
            this.document.body.contains(node));
    };
    endDragIfSourceWasRemovedFromDOM = () => {
        const node = this.currentDragSourceNode;
        if (node == null || this.isNodeInDocument(node)) {
            return;
        }
        if (this.clearCurrentDragSourceNode() && this.monitor.isDragging()) {
            this.actions.endDrag();
        }
    };
    setCurrentDragSourceNode(node) {
        this.clearCurrentDragSourceNode();
        this.currentDragSourceNode = node;
        // A timeout of > 0 is necessary to resolve Firefox issue referenced
        // See:
        //   * https://github.com/react-dnd/react-dnd/pull/928
        //   * https://github.com/react-dnd/react-dnd/issues/869
        const MOUSE_MOVE_TIMEOUT = 1000;
        // Receiving a mouse event in the middle of a dragging operation
        // means it has ended and the drag source node disappeared from DOM,
        // so the browser didn't dispatch the dragend event.
        //
        // We need to wait before we start listening for mousemove events.
        // This is needed because the drag preview needs to be drawn or else it fires an 'mousemove' event
        // immediately in some browsers.
        //
        // See:
        //   * https://github.com/react-dnd/react-dnd/pull/928
        //   * https://github.com/react-dnd/react-dnd/issues/869
        //
        this.mouseMoveTimeoutTimer = setTimeout(() => {
            return this.rootElement?.addEventListener('mousemove', this.endDragIfSourceWasRemovedFromDOM, true);
        }, MOUSE_MOVE_TIMEOUT);
    }
    clearCurrentDragSourceNode() {
        if (this.currentDragSourceNode) {
            this.currentDragSourceNode = null;
            if (this.rootElement) {
                this.window?.clearTimeout(this.mouseMoveTimeoutTimer || undefined);
                this.rootElement.removeEventListener('mousemove', this.endDragIfSourceWasRemovedFromDOM, true);
            }
            this.mouseMoveTimeoutTimer = null;
            return true;
        }
        return false;
    }
    handleTopDragStartCapture = () => {
        this.clearCurrentDragSourceNode();
        this.dragStartSourceIds = [];
    };
    handleDragStart(e, sourceId) {
        if (e.defaultPrevented) {
            return;
        }
        if (!this.dragStartSourceIds) {
            this.dragStartSourceIds = [];
        }
        this.dragStartSourceIds.unshift(sourceId);
    }
    handleTopDragStart = (e) => {
        if (e.defaultPrevented) {
            return;
        }
        const { dragStartSourceIds } = this;
        this.dragStartSourceIds = null;
        const clientOffset = getEventClientOffset(e);
        // Avoid crashing if we missed a drop event or our previous drag died
        if (this.monitor.isDragging()) {
            this.actions.endDrag();
        }
        // Don't publish the source just yet (see why below)
        this.actions.beginDrag(dragStartSourceIds || [], {
            publishSource: false,
            getSourceClientOffset: this.getSourceClientOffset,
            clientOffset,
        });
        const { dataTransfer } = e;
        const nativeType = matchNativeItemType(dataTransfer);
        if (this.monitor.isDragging()) {
            if (dataTransfer && typeof dataTransfer.setDragImage === 'function') {
                // Use custom drag image if user specifies it.
                // If child drag source refuses drag but parent agrees,
                // use parent's node as drag image. Neither works in IE though.
                const sourceId = this.monitor.getSourceId();
                const sourceNode = this.sourceNodes.get(sourceId);
                const dragPreview = this.sourcePreviewNodes.get(sourceId) || sourceNode;
                if (dragPreview) {
                    const { anchorX, anchorY, offsetX, offsetY } = this.getCurrentSourcePreviewNodeOptions();
                    const anchorPoint = { anchorX, anchorY };
                    const offsetPoint = { offsetX, offsetY };
                    const dragPreviewOffset = getDragPreviewOffset(sourceNode, dragPreview, clientOffset, anchorPoint, offsetPoint);
                    dataTransfer.setDragImage(dragPreview, dragPreviewOffset.x, dragPreviewOffset.y);
                }
            }
            try {
                // Firefox won't drag without setting data
                dataTransfer?.setData('application/json', {});
            }
            catch (err) {
                // IE doesn't support MIME types in setData
            }
            // Store drag source node so we can check whether
            // it is removed from DOM and trigger endDrag manually.
            this.setCurrentDragSourceNode(e.target);
            // Now we are ready to publish the drag source.. or are we not?
            const { captureDraggingState } = this.getCurrentSourcePreviewNodeOptions();
            if (!captureDraggingState) {
                // Usually we want to publish it in the next tick so that browser
                // is able to screenshot the current (not yet dragging) state.
                //
                // It also neatly avoids a situation where render() returns null
                // in the same tick for the source element, and browser freaks out.
                setTimeout(() => this.actions.publishDragSource(), 0);
            }
            else {
                // In some cases the user may want to override this behavior, e.g.
                // to work around IE not supporting custom drag previews.
                //
                // When using a custom drag layer, the only way to prevent
                // the default drag preview from drawing in IE is to screenshot
                // the dragging state in which the node itself has zero opacity
                // and height. In this case, though, returning null from render()
                // will abruptly end the dragging, which is not obvious.
                //
                // This is the reason such behavior is strictly opt-in.
                this.actions.publishDragSource();
            }
        }
        else if (nativeType) {
            // A native item (such as URL) dragged from inside the document
            this.beginDragNativeItem(nativeType);
        }
        else if (dataTransfer &&
            !dataTransfer.types &&
            ((e.target && !e.target.hasAttribute) ||
                !e.target.hasAttribute('draggable'))) {
            // Looks like a Safari bug: dataTransfer.types is null, but there was no draggable.
            // Just let it drag. It's a native type (URL or text) and will be picked up in
            // dragenter handler.
            return;
        }
        else {
            // If by this time no drag source reacted, tell browser not to drag.
            e.preventDefault();
        }
    };
    handleTopDragEndCapture = () => {
        if (this.clearCurrentDragSourceNode() && this.monitor.isDragging()) {
            // Firefox can dispatch this event in an infinite loop
            // if dragend handler does something like showing an alert.
            // Only proceed if we have not handled it already.
            this.actions.endDrag();
        }
    };
    handleTopDragEnterCapture = (e) => {
        this.dragEnterTargetIds = [];
        const isFirstEnter = this.enterLeaveCounter.enter(e.target);
        if (!isFirstEnter || this.monitor.isDragging()) {
            return;
        }
        const { dataTransfer } = e;
        const nativeType = matchNativeItemType(dataTransfer);
        if (nativeType) {
            // A native item (such as file or URL) dragged from outside the document
            this.beginDragNativeItem(nativeType, dataTransfer);
        }
    };
    handleDragEnter(e, targetId) {
        this.dragEnterTargetIds.unshift(targetId);
    }
    handleTopDragEnter = (e) => {
        const { dragEnterTargetIds } = this;
        this.dragEnterTargetIds = [];
        if (!this.monitor.isDragging()) {
            // This is probably a native item type we don't understand.
            return;
        }
        this.altKeyPressed = e.altKey;
        // If the target changes position as the result of `dragenter`, `dragover` might still
        // get dispatched despite target being no longer there. The easy solution is to check
        // whether there actually is a target before firing `hover`.
        if (dragEnterTargetIds.length > 0) {
            this.actions.hover(dragEnterTargetIds, {
                clientOffset: getEventClientOffset(e),
            });
        }
        const canDrop = dragEnterTargetIds.some((targetId) => this.monitor.canDropOnTarget(targetId));
        if (canDrop) {
            // IE requires this to fire dragover events
            e.preventDefault();
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = this.getCurrentDropEffect();
            }
        }
    };
    handleTopDragOverCapture = () => {
        this.dragOverTargetIds = [];
    };
    handleDragOver(e, targetId) {
        if (this.dragOverTargetIds === null) {
            this.dragOverTargetIds = [];
        }
        this.dragOverTargetIds.unshift(targetId);
    }
    handleTopDragOver = (e) => {
        const { dragOverTargetIds } = this;
        this.dragOverTargetIds = [];
        if (!this.monitor.isDragging()) {
            // This is probably a native item type we don't understand.
            // Prevent default "drop and blow away the whole document" action.
            e.preventDefault();
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'none';
            }
            return;
        }
        this.altKeyPressed = e.altKey;
        this.lastClientOffset = getEventClientOffset(e);
        if (this.hoverRafId === null &&
            typeof requestAnimationFrame !== 'undefined') {
            this.hoverRafId = requestAnimationFrame(() => {
                if (this.monitor.isDragging()) {
                    this.actions.hover(dragOverTargetIds || [], {
                        clientOffset: this.lastClientOffset,
                    });
                }
                this.hoverRafId = null;
            });
        }
        const canDrop = (dragOverTargetIds || []).some((targetId) => this.monitor.canDropOnTarget(targetId));
        if (canDrop) {
            // Show user-specified drop effect.
            e.preventDefault();
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = this.getCurrentDropEffect();
            }
        }
        else if (this.isDraggingNativeItem()) {
            // Don't show a nice cursor but still prevent default
            // "drop and blow away the whole document" action.
            e.preventDefault();
        }
        else {
            e.preventDefault();
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'none';
            }
        }
    };
    handleTopDragLeaveCapture = (e) => {
        if (this.isDraggingNativeItem()) {
            e.preventDefault();
        }
        const isLastLeave = this.enterLeaveCounter.leave(e.target);
        if (!isLastLeave) {
            return;
        }
        if (this.isDraggingNativeItem()) {
            setTimeout(() => this.endDragNativeItem(), 0);
        }
    };
    handleTopDropCapture = (e) => {
        this.dropTargetIds = [];
        if (this.isDraggingNativeItem()) {
            e.preventDefault();
            this.currentNativeSource?.loadDataTransfer(e.dataTransfer);
        }
        else if (matchNativeItemType(e.dataTransfer)) {
            // Dragging some elements, like <a> and <img> may still behave like a native drag event,
            // even if the current drag event matches a user-defined type.
            // Stop the default behavior when we're not expecting a native item to be dropped.
            e.preventDefault();
        }
        this.enterLeaveCounter.reset();
    };
    handleDrop(e, targetId) {
        this.dropTargetIds.unshift(targetId);
    }
    handleTopDrop = (e) => {
        const { dropTargetIds } = this;
        this.dropTargetIds = [];
        this.actions.hover(dropTargetIds, {
            clientOffset: getEventClientOffset(e),
        });
        this.actions.drop({ dropEffect: this.getCurrentDropEffect() });
        if (this.isDraggingNativeItem()) {
            this.endDragNativeItem();
        }
        else if (this.monitor.isDragging()) {
            this.actions.endDrag();
        }
    };
    handleSelectStart = (e) => {
        const target = e.target;
        // Only IE requires us to explicitly say
        // we want drag drop operation to start
        if (typeof target.dragDrop !== 'function') {
            return;
        }
        // Inputs and textareas should be selectable
        if (target.tagName === 'INPUT' ||
            target.tagName === 'SELECT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable) {
            return;
        }
        // For other targets, ask IE
        // to enable drag and drop
        e.preventDefault();
        target.dragDrop();
    };
}
