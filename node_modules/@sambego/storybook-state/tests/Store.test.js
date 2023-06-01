import Store from "../src/Store";

test("create a store", () => {
  const store = new Store({
    foo: "bar"
  });

  expect(store).toBeDefined();
  expect(store).toBeInstanceOf(Store);
});

test("get the complete state from the store", () => {
  const store = new Store({
    foo: "bar",
    bar: "foo"
  });

  expect(store.get).toBeDefined();
  expect(store.get()).toEqual({
    foo: "bar",
    bar: "foo"
  });
});

test("get properties from the store", () => {
  const store = new Store({
    foo: "bar",
    active: true,
    items: ["item 1", "item 2"]
  });

  expect(store.get).toBeDefined();

  expect(store.get("foo")).toBeDefined();
  expect(store.get("foo")).toBe("bar");

  expect(store.get("active")).toBeDefined();
  expect(store.get("active")).toBe(true);

  expect(store.get("items")).toBeDefined();
  expect(store.get("items")).toHaveLength(2);
  expect(store.get("items")).toEqual(["item 1", "item 2"]);
});

test("update properties from the store", () => {
  const store = new Store({
    foo: "bar",
    active: true
  });

  expect(store.set).toBeDefined();
  expect(store.get("foo")).toBe("bar");
  expect(store.get("active")).toBe(true);

  store.set({ foo: "baz" });

  expect(store.get("foo")).toBe("baz");
  expect(store.get("active")).toBe(true);

  store.set({ active: false });

  expect(store.get("foo")).toBe("baz");
  expect(store.get("active")).toBe(false);

  store.set({ foo: "bax", active: true });

  expect(store.get("foo")).toBe("bax");
  expect(store.get("active")).toBe(true);
});

test("subscribe and get notified when the store updates", () => {
  const store = new Store({
    foo: "bar"
  });

  const updateStoreValue = jest.fn(state => {
    return state.foo;
  });

  store.subscribe(updateStoreValue);
  store.set({ foo: "bax" });
  store.set({ foo: "baz" });

  expect(store.subscribe).toBeDefined();
  expect(updateStoreValue).toHaveBeenCalled();
  expect(updateStoreValue).toHaveBeenCalledTimes(2);
  expect(updateStoreValue).toHaveReturnedWith("bax");
  expect(updateStoreValue).toHaveReturnedWith("baz");
});
