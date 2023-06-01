import uuid from "uuid";

export default class Store {
  state = {};
  callbacks = [];

  constructor(state) {
    this.state = { ...state };
  }

  set(newState) {
    this.state = { ...this.state, ...newState };
    this.callbacks.forEach(callback => callback.callback(this.state));
  }

  get(key) {
    if (key) {
      return this.state[key];
    }

    return this.state;
  }

  subscribe(callback) {
    const subscription = uuid();

    this.callbacks.push({ subscription, callback });

    return subscription;
  }

  unSubscribe(subscription) {
    this.callbacks.forEach((callback, index) => {
      if (callback.subscription === subscription) {
        this.callbacks.splice(index, 1);
      }
    });
  }
}
