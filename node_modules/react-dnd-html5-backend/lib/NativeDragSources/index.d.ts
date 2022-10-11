import { NativeDragSource } from './NativeDragSource';
export declare function createNativeDragSource(type: string, dataTransfer?: DataTransfer): NativeDragSource;
export declare function matchNativeItemType(dataTransfer: DataTransfer | null): string | null;
