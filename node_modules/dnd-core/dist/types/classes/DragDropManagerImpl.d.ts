import { Store, Action } from 'redux';
import { Backend, DragDropActions, DragDropMonitor, DragDropManager, HandlerRegistry } from '../interfaces';
import { State } from '../reducers';
export declare class DragDropManagerImpl implements DragDropManager {
    private store;
    private monitor;
    private backend;
    private isSetUp;
    constructor(store: Store<State>, monitor: DragDropMonitor);
    receiveBackend(backend: Backend): void;
    getMonitor(): DragDropMonitor;
    getBackend(): Backend;
    getRegistry(): HandlerRegistry;
    getActions(): DragDropActions;
    dispatch(action: Action<any>): void;
    private handleRefCountChange;
}
