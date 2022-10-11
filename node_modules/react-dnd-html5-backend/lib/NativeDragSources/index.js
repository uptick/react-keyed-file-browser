import { nativeTypesConfig } from './nativeTypesConfig';
import { NativeDragSource } from './NativeDragSource';
export function createNativeDragSource(type, dataTransfer) {
    const result = new NativeDragSource(nativeTypesConfig[type]);
    result.loadDataTransfer(dataTransfer);
    return result;
}
export function matchNativeItemType(dataTransfer) {
    if (!dataTransfer) {
        return null;
    }
    const dataTransferTypes = Array.prototype.slice.call(dataTransfer.types || []);
    return (Object.keys(nativeTypesConfig).filter((nativeItemType) => {
        const { matchesTypes } = nativeTypesConfig[nativeItemType];
        return matchesTypes.some((t) => dataTransferTypes.indexOf(t) > -1);
    })[0] || null);
}
