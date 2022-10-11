/// <reference types="node" />
/// <reference types="webpack-env" />
import { StoryFn, Parameters } from '@storybook/addons';
import { ClientApiParams, DecoratorFunction, StoryApi } from './types';
import StoryStore from './story_store';
export declare const defaultDecorateStory: (storyFn: StoryFn<unknown>, decorators: DecoratorFunction<unknown>[]) => StoryFn<unknown>;
export declare const addDecorator: (decoratorFn: DecoratorFunction<unknown>) => void;
export declare const addParameters: (parameters: Parameters) => void;
export default class ClientApi {
    private _storyStore;
    private _addons;
    private _decorateStory;
    private _noStoryModuleAddMethodHotDispose;
    constructor({ storyStore, decorateStory, noStoryModuleAddMethodHotDispose, }: ClientApiParams);
    setAddon: (addon: any) => void;
    getSeparators: () => {
        hierarchySeparator: RegExp;
        hierarchyRootSeparator: string;
    } | {
        hierarchySeparator: string;
        hierarchyRootSeparator?: undefined;
    };
    addDecorator: (decorator: DecoratorFunction<unknown>) => void;
    addParameters: (parameters: Parameters) => void;
    clearDecorators: () => void;
    clearParameters: () => void;
    storiesOf: <StoryFnReturnType = unknown>(kind: string, m: NodeModule) => StoryApi<StoryFnReturnType>;
    getStorybook: () => {
        kind: string;
        fileName: string;
        stories: {
            name: any;
            render: any;
        }[];
    }[];
    raw: () => import("./types").StoreItem[];
    store: () => StoryStore;
}
