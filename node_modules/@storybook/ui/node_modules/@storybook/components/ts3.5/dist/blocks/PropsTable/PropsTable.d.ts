import React, { FC } from 'react';
import { PropDef, PropType, PropDefaultValue, PropSummaryValue } from './PropDef';
export declare const Table: import("@emotion/styled-base").StyledComponent<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>, {}, import("@storybook/theming").Theme>;
export declare enum PropsTableError {
    NO_COMPONENT = "No component found",
    PROPS_UNSUPPORTED = "Props unsupported. See Props documentation for your framework."
}
export interface PropsTableRowsProps {
    rows: PropDef[];
}
export interface PropsTableSectionsProps {
    sections?: Record<string, PropDef[]>;
}
export interface PropsTableErrorProps {
    error: PropsTableError;
}
export declare type PropsTableProps = PropsTableRowsProps | PropsTableSectionsProps | PropsTableErrorProps;
/**
 * Display the props for a component as a props table. Each row is a collection of
 * PropDefs, usually derived from docgen info for the component.
 */
declare const PropsTable: FC<PropsTableProps>;
export { PropsTable, PropDef, PropType, PropDefaultValue, PropSummaryValue };
