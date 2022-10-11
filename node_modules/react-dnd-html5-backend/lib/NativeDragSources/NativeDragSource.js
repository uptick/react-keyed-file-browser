export class NativeDragSource {
    item;
    config;
    constructor(config) {
        this.config = config;
        this.item = {};
        this.initializeExposedProperties();
    }
    initializeExposedProperties() {
        Object.keys(this.config.exposeProperties).forEach((property) => {
            Object.defineProperty(this.item, property, {
                configurable: true,
                enumerable: true,
                get() {
                    // eslint-disable-next-line no-console
                    console.warn(`Browser doesn't allow reading "${property}" until the drop event.`);
                    return null;
                },
            });
        });
    }
    loadDataTransfer(dataTransfer) {
        if (dataTransfer) {
            const newProperties = {};
            Object.keys(this.config.exposeProperties).forEach((property) => {
                newProperties[property] = {
                    value: this.config.exposeProperties[property](dataTransfer, this.config.matchesTypes),
                    configurable: true,
                    enumerable: true,
                };
            });
            Object.defineProperties(this.item, newProperties);
        }
    }
    canDrag() {
        return true;
    }
    beginDrag() {
        return this.item;
    }
    isDragging(monitor, handle) {
        return handle === monitor.getSourceId();
    }
    endDrag() {
        // empty
    }
}
