import { ReactNode } from 'react';
import { LocationProvider, RouteComponentProps, NavigateFn } from '@reach/router';
interface Other {
    viewMode?: string;
    storyId?: string;
}
export declare type RenderData = RouteComponentProps & Other;
interface MatchingData {
    match: null | {
        path: string;
    };
}
interface QueryLocationProps {
    children: (renderData: RenderData) => ReactNode;
}
interface QueryMatchProps {
    path: string;
    startsWith: boolean;
    children: (matchingData: MatchingData) => ReactNode;
}
interface RouteProps {
    path: string;
    startsWith: boolean;
    hideOnly: boolean;
    children: (renderData: RenderData) => ReactNode;
}
interface QueryLinkProps {
    to: string;
    children: ReactNode;
}
declare const queryNavigate: NavigateFn;
declare const QueryLink: {
    ({ to, children, ...rest }: QueryLinkProps): JSX.Element;
    displayName: string;
};
declare const QueryLocation: {
    ({ children }: QueryLocationProps): JSX.Element;
    displayName: string;
};
declare const QueryMatch: {
    ({ children, path: targetPath, startsWith }: QueryMatchProps): JSX.Element;
    displayName: string;
};
declare const Route: {
    ({ path, children, startsWith, hideOnly }: RouteProps): JSX.Element;
    displayName: string;
};
export { QueryLink as Link };
export { QueryMatch as Match };
export { QueryLocation as Location };
export { Route };
export { queryNavigate as navigate };
export { LocationProvider };
