/// <reference types="lodash/common/common" />
/// <reference types="lodash/common/array" />
/// <reference types="lodash/common/collection" />
/// <reference types="lodash/common/date" />
/// <reference types="lodash/common/function" />
/// <reference types="lodash/common/lang" />
/// <reference types="lodash/common/math" />
/// <reference types="lodash/common/number" />
/// <reference types="lodash/common/object" />
/// <reference types="lodash/common/seq" />
/// <reference types="lodash/common/string" />
/// <reference types="lodash/common/util" />
import EventEmitter from 'eventemitter3';
import { Channel } from '@storybook/channels';
import { StoryFn, Parameters } from '@storybook/addons';
import { DecoratorFunction, LegacyData, StoreData, AddStoryArgs, StoreItem, ErrorLike } from './types';
interface Selection {
    storyId: string;
    viewMode: string;
}
interface StoryOptions {
    includeDocsOnly?: boolean;
}
declare type KindOrder = Record<string, number>;
export default class StoryStore extends EventEmitter {
    _error?: ErrorLike;
    _channel: Channel;
    _data: StoreData;
    _legacyData?: LegacyData;
    _legacydata: LegacyData;
    _revision: number;
    _selection: Selection;
    _kindOrder: KindOrder;
    constructor(params: {
        channel: Channel;
    });
    setChannel: (channel: Channel) => void;
    fromId: (id: string) => StoreItem;
    raw(options?: StoryOptions): StoreItem[];
    extract(options?: StoryOptions): {};
    setSelection(data: Selection | undefined, error: ErrorLike): void;
    getSelection: () => Selection;
    getError: () => ErrorLike;
    remove: (id: string) => void;
    addStory({ id, kind, name, storyFn: original, parameters }: AddStoryArgs, { getDecorators, applyDecorators, }: {
        getDecorators: () => DecoratorFunction[];
        applyDecorators: (fn: StoryFn, decorators: DecoratorFunction[]) => any;
    }): void;
    getStoriesForManager: () => {};
    pushToManager: (() => void) & import("lodash").Cancelable;
    getStoriesForKind(kind: string): StoreItem[];
    getRawStory(kind: string, name: string): StoreItem;
    getRevision(): number;
    incrementRevision(): void;
    addLegacyStory({ kind, name, storyFn, parameters, }: {
        kind: string;
        name: string;
        storyFn: StoryFn;
        parameters: Parameters;
    }): void;
    getStoryKinds(): string[];
    getStories(kind: string): any[];
    getStoryFileName(kind: string): string;
    getStoryAndParameters(kind: string, name: string): {
        story: any;
        parameters: any;
    };
    getStory(kind: string, name: string): any;
    getStoryWithContext(kind: string, name: string): any;
    removeStoryKind(kind: string): void;
    hasStoryKind(kind: string): boolean;
    hasStory(kind: string, name: string): boolean;
    dumpStoryBook(): {
        kind: string;
        stories: any[];
    }[];
    size(): number;
    clean(): void;
    cleanHooks(id: string): void;
    cleanHooksForKind(kind: string): void;
}
export {};
