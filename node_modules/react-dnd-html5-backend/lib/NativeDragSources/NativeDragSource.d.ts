import { NativeItemConfig } from './nativeTypesConfig';
import { DragDropMonitor } from 'dnd-core';
export declare class NativeDragSource {
    item: any;
    private config;
    constructor(config: NativeItemConfig);
    private initializeExposedProperties;
    loadDataTransfer(dataTransfer: DataTransfer | null | undefined): void;
    canDrag(): boolean;
    beginDrag(): any;
    isDragging(monitor: DragDropMonitor, handle: string): boolean;
    endDrag(): void;
}
