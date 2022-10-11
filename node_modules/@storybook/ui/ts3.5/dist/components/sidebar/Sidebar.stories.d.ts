import React from 'react';
declare const _default: {
    component: React.FunctionComponent<import("./Sidebar").SidebarProps>;
    title: string;
    excludeStories: RegExp;
};
export default _default;
export declare const simpleData: {
    menu: {
        title: string;
        onClick: import("@storybook/addon-actions").HandlerFunction;
        id: string;
    }[];
    stories: any;
    storyId: string;
};
export declare const loadingData: {
    menu: {
        title: string;
        onClick: import("@storybook/addon-actions").HandlerFunction;
        id: string;
    }[];
    stories: {};
};
export declare const simple: () => JSX.Element;
export declare const loading: () => JSX.Element;
