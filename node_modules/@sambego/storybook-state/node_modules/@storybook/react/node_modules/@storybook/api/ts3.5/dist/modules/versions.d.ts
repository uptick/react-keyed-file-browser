import { Module, API } from '../index';
export interface Version {
    version: string;
    info?: string;
    [key: string]: any;
}
export interface UnknownEntries {
    [key: string]: {
        [key: string]: any;
    };
}
export interface Versions {
    latest?: Version;
    next?: Version;
    current?: Version;
}
export interface SubState {
    versions: Versions & UnknownEntries;
    lastVersionCheck: number;
    dismissedVersionNotification: undefined | string;
}
export interface SubAPI {
    getCurrentVersion: () => Version;
    getLatestVersion: () => Version;
    versionUpdateAvailable: () => boolean;
}
export default function ({ store, mode }: Module): {
    init: ({ api: fullApi }: API) => Promise<void>;
    state: {
        versions: {
            latest?: Version;
            next?: Version;
            current: Version | {
                version: string;
            };
        };
        dismissedVersionNotification: string;
    };
    api: SubAPI;
};
