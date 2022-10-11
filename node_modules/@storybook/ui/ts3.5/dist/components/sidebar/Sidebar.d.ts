import { FunctionComponent } from 'react';
import { State } from '@storybook/api';
export interface SidebarProps {
    stories: State['StoriesHash'];
    menu: any[];
    storyId?: string;
    menuHighlighted?: boolean;
    loading?: boolean;
}
declare const Sidebar: FunctionComponent<SidebarProps>;
export default Sidebar;
