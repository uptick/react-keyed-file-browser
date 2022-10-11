import { ThemeVars } from '@storybook/theming';
import { State } from '../index';
import Store from '../store';
import { Provider } from '../init-provider-api';
export declare type PanelPositions = 'bottom' | 'right';
export interface Layout {
    isFullscreen: boolean;
    showPanel: boolean;
    panelPosition: PanelPositions;
    showNav: boolean;
    isToolshown: boolean;
}
export interface UI {
    name?: string;
    url?: string;
    enableShortcuts: boolean;
    sidebarAnimations: boolean;
    docsMode: boolean;
}
export interface SubState {
    layout: Layout;
    ui: UI;
    selectedPanel: string | undefined;
    theme: ThemeVars;
}
export interface SubAPI {
    toggleFullscreen: (toggled?: boolean) => void;
    togglePanel: (toggled?: boolean) => void;
    togglePanelPosition: (position?: PanelPositions) => void;
    toggleNav: (toggled?: boolean) => void;
    toggleToolbar: (toggled?: boolean) => void;
    setOptions: (options: any) => void;
}
export declare const focusableUIElements: {
    storySearchField: string;
    storyListMenu: string;
    storyPanelRoot: string;
};
export default function ({ store, provider }: {
    store: Store;
    provider: Provider;
}): {
    api: {
        toggleFullscreen(toggled?: boolean): Promise<State>;
        togglePanel(toggled?: boolean): Promise<State>;
        togglePanelPosition(position?: PanelPositions): Promise<State>;
        toggleNav(toggled?: boolean): Promise<State>;
        toggleToolbar(toggled?: boolean): Promise<State>;
        resetLayout(): Promise<State>;
        focusOnUIElement(elementId?: string): void;
        getInitialOptions(): {
            layout: {
                isFullscreen: boolean;
                showPanel: boolean;
                panelPosition: PanelPositions;
                showNav: boolean;
                isToolshown: boolean;
            };
            ui: {
                name?: string;
                url?: string;
                enableShortcuts: boolean;
                sidebarAnimations: boolean;
                docsMode: boolean;
            };
            selectedPanel: any;
            theme: any;
        };
        setOptions: (options: any) => void;
    };
    state: any;
};
