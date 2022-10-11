import { ComponentProps } from 'react';
import { Icons } from '@storybook/components';
export declare type ExpanderProps = ComponentProps<'span'> & {
    isExpanded?: boolean;
    isExpandable?: boolean;
};
export declare type IconProps = ComponentProps<typeof Icons> & {
    className: string;
    isSelected?: boolean;
};
export declare const Item: import("@emotion/styled-base").StyledComponent<any, Pick<any, string | number | symbol>, import("@storybook/theming").Theme>;
declare const SidebarItem: ({ name, isComponent, isLeaf, isExpanded, isSelected, ...props }: any) => JSX.Element;
export default SidebarItem;
