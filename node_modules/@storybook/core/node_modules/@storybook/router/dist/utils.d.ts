import * as csf from '@storybook/csf';
export declare const toId: (kind: string, name: string) => string, parseKind: (kind: string, { rootSeparator, groupSeparator }: csf.SeparatorOptions) => {
    root: string;
    groups: string[];
}, sanitize: (string: string) => string, storyNameFromExport: (key: string) => string;
interface StoryData {
    viewMode?: string;
    storyId?: string;
}
export declare const parsePath: (path?: string) => StoryData;
interface Query {
    [key: string]: any;
}
export declare const queryFromString: (s: string) => Query;
export declare const queryFromLocation: (location: {
    search: string;
}) => Query;
export declare const stringifyQuery: (query: Query) => any;
export declare const getMatch: (current: string, target: string, startsWith?: any) => {
    path: string;
};
export {};
