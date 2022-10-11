import { ComponentProps, FunctionComponent } from 'react';
import { PrismLight as ReactSyntaxHighlighter } from 'react-syntax-highlighter';
export interface WrapperProps {
    bordered?: boolean;
    padded?: boolean;
}
export interface PreProps {
    padded?: boolean;
}
export interface SyntaxHighlighterProps {
    language: string;
    copyable?: boolean;
    bordered?: boolean;
    padded?: boolean;
    format?: boolean;
    className?: string;
}
export interface SyntaxHighlighterState {
    copied: boolean;
}
declare type ReactSyntaxHighlighterProps = ComponentProps<typeof ReactSyntaxHighlighter>;
declare type Props = SyntaxHighlighterProps & ReactSyntaxHighlighterProps;
export declare const SyntaxHighlighter: FunctionComponent<Props>;
export {};
