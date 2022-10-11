import { ComponentProps } from 'react';
export declare type FilterFieldProps = ComponentProps<'input'>;
export declare type CancelButtonProps = ComponentProps<'button'>;
export declare type FilterFormProps = ComponentProps<'form'> & {
    focussed: boolean;
};
export declare type PureSidebarSearchProps = FilterFieldProps & {
    onChange: (arg: string) => void;
};
export declare const PureSidebarSearch: ({ className, onChange, ...props }: PureSidebarSearchProps) => JSX.Element;
export default PureSidebarSearch;
