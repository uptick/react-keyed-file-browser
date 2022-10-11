import { ComponentProps } from 'react';
import { TooltipLinkList, Button } from '@storybook/components';
export declare type BrandAreaProps = ComponentProps<'div'>;
export declare type MenuButtonProps = ComponentProps<typeof Button> & ComponentProps<'button'> & {
    highlighted: boolean;
};
export interface SidebarHeadingProps {
    menuHighlighted?: boolean;
    menu: ComponentProps<typeof TooltipLinkList>['links'];
    className?: string;
}
declare const SidebarHeading: ({ menuHighlighted, menu, ...props }: SidebarHeadingProps) => JSX.Element;
export default SidebarHeading;
