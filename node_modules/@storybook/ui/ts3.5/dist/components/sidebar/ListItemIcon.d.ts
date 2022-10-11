import { ComponentProps } from 'react';
import { Icons } from '@storybook/components';
export interface ListItemIconProps {
    icon?: ComponentProps<typeof Icons>['icon'];
    imgSrc?: string;
}
declare const ListItemIcon: ({ icon, imgSrc }: ListItemIconProps) => JSX.Element;
export default ListItemIcon;
