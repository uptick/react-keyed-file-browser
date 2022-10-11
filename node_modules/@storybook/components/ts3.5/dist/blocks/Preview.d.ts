import { FunctionComponent } from 'react';
import { SourceProps } from './Source';
export interface PreviewProps {
    isColumn?: boolean;
    columns?: number;
    withSource?: SourceProps;
    isExpanded?: boolean;
    withToolbar?: boolean;
    className?: string;
}
/**
 * A preview component for showing one or more component `Story`
 * items. The preview also shows the source for the component
 * as a drop-down.
 */
declare const Preview: FunctionComponent<PreviewProps>;
export { Preview };
