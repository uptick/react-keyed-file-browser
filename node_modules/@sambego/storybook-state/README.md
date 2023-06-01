# Storybook state

### Warning

**Storybook recently introduced a new way of building addons, the latest version of storybook-state will work with version of storybook > `v5.2.*`. For older versions of storybook use `v1.3.6` of this addon.**

---

### Getting Started

```sh
npm install --save-dev @sambego/storybook-state
```

First you will need to create a new store, to save the state and handle updates.
You can add all properties which your component expects, and the State component will propagate them to your component.
Once you've created the store, you can wrap your components in a `State` component and pass along the store.

In the example below we create a modal which will expect an `active` property.
When clicking on the button we will update the store, which in turn will update the property `active` on the modal;

#### Display and update using a State component

```js
import React from "react";
import { storiesOf } from "@storybook/react";
import { State, Store } from "@sambego/storybook-state";

const store = new Store({
  active: false
});

const SimpleModal = props => (
  <div>
    <State store={store}>
      <Modal>Modal content</Modal>
    </State>
    <Button onClick={() => store.set({ active: !store.get("active") })} />
  </div>
);

export default { title: "Modal" };
export const Simple = () => SimpleModal;
```

#### Display and update using a State decorator

```js
import React from "react";
import { addDecorator, addParameters } from "@storybook/react";
import { Store, withState } from "@sambego/storybook-state";

const SimpleCounter = props => {
  return [
    <p> Count: {props.count} </p>,
    <button onClick={props.handleCountUpdate}> {props.count} </button>
  ];
};

const store = new Store({
  count: 0,
  handleCountUpdate: () => store.set({ count: store.get("count") + 1 })
});

addDecorator(withState());
addParameters({
  state: {
    store
  }
});

export default { title: "Counter" };
export const Simple = () => SimpleCounter;
```

### Store

The store has a few methods you can use to get and update the state.

When creating a new instance, you can pass along the initial state.

```js
const store = new Store({
  foo: "bar",
  active: true,
  items: ["item 1", "item 2"]
});
```

You can retrieve a state from the store by using the `get()` method.

```js
store.get("foo"); // will return 'bar'
store.get("active"); // will return true
store.get("items"); // will return ['item 1', 'item 2']
```

You can update the store by using the `set()` method.

```js
store.set({
  active: false,
  bar: "foo"
});
```

You can subscribe to changes in the store by using the `subscribe()` method.
You can register a callback, which will have the updated state as the first parameter whenever the state updates.

```js
store.subscribe(state => // Do something with the updated state.
```

### State component

The state component accepts one property, an instance of `Store`. All properties that depend on the state, or should update on state changes, should be added in the Store, and will be propagated to your component by the `<State />` component.

```js
<State store={store}>
  <StateDependendComponent />
</State>
```

The state also allows a function as a child so you can pass the state to any prop of your components.

```js
const store = new Store({
  active: true
});

<State store={store}>
  {state => [
    <ElementOne active={state.active} />,
    <ElementTwo checked={state.active} />
  ]}
</State>;
```

You can also manipulate the state before passing it to the children via the parseState property.

```js
<State store={store} parseState={state => ({ ...state, id: `#${state.uuid}` })}>
  <StateDependendComponent />
</State>
```

When using the `withState` decorator, you can pass along the state parser function as a parameter.

```js
addDecorator(withState());
addParameters({
  state: {
    store,
    parseState: state => ({ ...state, count: `foo-${state.count}` })
  }
});
```
