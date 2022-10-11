import { DragDropManagerImpl } from './classes/DragDropManagerImpl';
import { createStore } from 'redux';
import { reduce } from './reducers';
import { DragDropMonitorImpl } from './classes/DragDropMonitorImpl';
import { HandlerRegistryImpl } from './classes/HandlerRegistryImpl';
export function createDragDropManager(backendFactory, globalContext = undefined, backendOptions = {}, debugMode = false) {
    const store = makeStoreInstance(debugMode);
    const monitor = new DragDropMonitorImpl(store, new HandlerRegistryImpl(store));
    const manager = new DragDropManagerImpl(store, monitor);
    const backend = backendFactory(manager, globalContext, backendOptions);
    manager.receiveBackend(backend);
    return manager;
}
function makeStoreInstance(debugMode) {
    // TODO: if we ever make a react-native version of this,
    // we'll need to consider how to pull off dev-tooling
    const reduxDevTools = typeof window !== 'undefined' &&
        window.__REDUX_DEVTOOLS_EXTENSION__;
    return createStore(reduce, debugMode &&
        reduxDevTools &&
        reduxDevTools({
            name: 'dnd-core',
            instanceId: 'dnd-core',
        }));
}
