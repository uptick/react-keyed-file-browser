import * as NativeTypes from '../NativeTypes';
import { getDataFromDataTransfer } from './getDataFromDataTransfer';
export const nativeTypesConfig = {
    [NativeTypes.FILE]: {
        exposeProperties: {
            files: (dataTransfer) => Array.prototype.slice.call(dataTransfer.files),
            items: (dataTransfer) => dataTransfer.items,
            dataTransfer: (dataTransfer) => dataTransfer,
        },
        matchesTypes: ['Files'],
    },
    [NativeTypes.HTML]: {
        exposeProperties: {
            html: (dataTransfer, matchesTypes) => getDataFromDataTransfer(dataTransfer, matchesTypes, ''),
            dataTransfer: (dataTransfer) => dataTransfer,
        },
        matchesTypes: ['Html', 'text/html'],
    },
    [NativeTypes.URL]: {
        exposeProperties: {
            urls: (dataTransfer, matchesTypes) => getDataFromDataTransfer(dataTransfer, matchesTypes, '').split('\n'),
            dataTransfer: (dataTransfer) => dataTransfer,
        },
        matchesTypes: ['Url', 'text/uri-list'],
    },
    [NativeTypes.TEXT]: {
        exposeProperties: {
            text: (dataTransfer, matchesTypes) => getDataFromDataTransfer(dataTransfer, matchesTypes, ''),
            dataTransfer: (dataTransfer) => dataTransfer,
        },
        matchesTypes: ['Text', 'text/plain'],
    },
};
