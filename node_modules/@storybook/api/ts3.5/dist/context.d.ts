/// <reference types="@emotion/core" />
import { Combo } from './index';
export declare const createContext: ({ api, state }: Combo) => import("react").Context<{
    api: import(".").API;
    state: import(".").State;
}>;
