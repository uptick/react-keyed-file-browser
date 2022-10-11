import { FunctionComponent } from 'react';
interface ColorProps {
    title: string;
    subtitle: string;
    colors: string[];
}
/**
 * A single color row your styleguide showing title, subtitle and one or more colors, used
 * as a child of `ColorPalette`.
 */
export declare const ColorItem: FunctionComponent<ColorProps>;
/**
 * Styleguide documentation for colors, including names, captions, and color swatches,
 * all specified as `ColorItem` children of this wrapper component.
 */
export declare const ColorPalette: FunctionComponent;
export {};
