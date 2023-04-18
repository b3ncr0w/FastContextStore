# Fast Context Store - Docs

This program provides a data management solution for React applications that allows for efficient updates and rerenders by subscribing to changes in specific data selectors. It also includes patterns for observing or ignoring certain selectors, as well as options for updating only when the data changes. By using this approach, the program avoids unnecessary rerenders and improves performance compared to typical approaches to data storage in React applications, which can be especially beneficial for larger and more complex applications or for those using high velocity data.

# Dependency

- `cloneDeep` and `isEqual` from "lodash" library

# Core functionality

The `useStoreCore` hook function is generic and takes an optional initial value for the data store as its argument.

```ts
useStoreCore<T>(initData?: T | object)
```

The function returns an object containing four methods:

- `subscribe` - This method takes two arguments: `update` (a function that is called when the data in the store changes) and `subSettings` (an optional object that can be used to store subscriber-specific settings). The `subscribe` method adds a new subscriber to the context, and returns a function to unsubscribe the subscriber.
- `notify` - This method takes an object with properties `selector` and `settings` as its argument. It calls the `update` function for each subscriber with the updated data.
- `get` - This method returns the current value stored in the context.
- `set` - This method takes a value and sets the data stored in the context to the specified value.

The function uses the `useRef` hook to create two reference objects: `store` and `subscribers`. The `store` reference object holds the current value of the data store. The `subscribers` reference object is initialized as a new `Set` containing objects with two properties: `update`, a callback function that is called when the data changes, and `subSettings`, an optional object that can be used to store subscriber-specific settings.

The `useCallback` hook is used to create memoized versions of the `subscribe`, `notify`, `get`, and `set` methods, so that they can be passed down as props to child components without causing unnecessary re-renders.

Overall, the code creates a simple and efficient way to store and update data in a React application using the Context API, while providing selective re-rendering of components that depend on the data store.

# Functionality wrapper - createStore and useStore

The `createStore` function creates a React context and a provider component to wrap other components with. It returns an array with the context provider and a custom hook called `useStore`.

### Syntax

```jsx

const [StoreProvider, useStore] = createStore<T>(initData?: T);
```

### Parameters

`initData` (optional): An initial value to be assigned to the store's state data.

### Return Value

`createStore()` returns a tuple of two elements: the `StoreProvider` component and the `useStore()` hook.

- `StoreProvider`: A React component that provides the store's state data to its children components via context. This component should wrap any components that need access to the store data.
- `useStore()`: A React hook that returns an object with methods to read and update the store's state data.

### Usage

```jsx

import { createStore } from 'path/to/createStore';

// Create the store provider and hook
const [StoreProvider, useStore] = createStore<{ count: number }>({ count: 0 });

// Wrap the app with the store provider
function App() {
  return (
    <StoreProvider>
      <Counter />
    </StoreProvider>
  );
}

// Use the store hook inside a component
function Counter() {
  const { getStoreData, setStoreData } = useStore();

  function handleIncrement() {
    setStoreData((prev) => ({ count: prev.count + 1 }));
  }

  const count = getStoreData<{ count: number }>().count;

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}
```

### Methods Returned by `useStore()`

The `useStore()` hook returns an object with the following methods:

```ts
getStoreData(selector?: string, settings?: SettingsType): T
```

Returns the store's state data.

- `selector` (optional): A string that specifies a subproperty of the store's state data to return. If not provided, the entire state data is returned.
- `settings` (optional): An object that specifies the settings for subscribing to the state data changes. For more information about the available settings, refer to the `subscribeDataSnapshot()` function in the `storeUtils` module.

```ts
setStoreData(value: T | ((prev: T) => T), selector?: string, settings?: { doNotifyObservers?: boolean }): void
```

Updates the store's state data.

- `value`: The new value to assign to the store's state data. It can be an object, a primitive value, or a function that receives the previous state as an argument and returns the new state.
- `selector` (optional): A string that specifies a subproperty of the store's state data to update. If not provided, the entire state data is updated.
- `settings` (optional): An object that specifies the options for the update operation.
  - `doNotifyObservers` (optional): A boolean value that indicates whether to notify the observers about the state data changes. The default value is `true`.

```ts
updateWithSelector(selector: string): void
```

Notifies the observers that the state data with the specified selector has changed.

- `selector`: A string that specifies a subproperty of the store's state data that has changed.

# Store Utils

This file contains several utility functions to be used with the store.

## Functions

### `subscribeDataSnapshot`

This function is used to subscribe to changes in the store and retrieve data. It takes an object with two properties:

- `subscribe`: A function to be called when there's a change in the store. It takes a callback function as a parameter which will receive an object of type `UpdatePropsType`.
- `getDataSnapshot`: A function to retrieve data from the store.

The function returns a snapshot of the store data. The `UpdatePropsType` object has the following properties:

- `selector`: A string representing the path to the data that has been updated.
- `settings`: An optional object containing settings to customize the update process. The settings object can have the following properties:
  - `doObserveChanges`: A boolean that determines whether or not to observe changes. Defaults to `true`.
  - `doUpdateOnlyWhenDataChanges`: A boolean that determines whether or not to update only when data changes. If you want to update the component when a selector other than the one specified in the getter is used, you may need to set it to `false`. Defaults to `true`.
  - `observedSelectors`: An array of strings representing the selectors to observe.
  - `ignoredSelectors`: An array of strings representing the selectors to ignore.
  - `doForceUpdate`: A boolean that determines whether or not to force an update. If it's `true` it ignores all other settings. Defaults to `false`.

### `getDataWithSelector`

This function is used to retrieve data from the store. It takes an object and an optional string representing the selector. If a selector is provided, the function will traverse the object and return the data at the specified path. If no selector is provided, the entire object will be returned.

### `setDataWithSelector`

This function is used to set data in the store. It takes an object, a value, and an optional selector. If a selector is provided, the function will traverse the object and set the value at the specified path. If no selector is provided, the value will be returned. If the specified path does not exist in the object, an error will be logged to the console.

# Update function

The `update` function is used by the `subscribeDataSnapshot` function to update the `dataSnapshot` state whenever changes to the subscribed data occur. It takes an object with a `selector` and `settings` property as its argument. The `selector` property specifies the property to update, while the `settings` property can contain options for controlling how the update is performed.

The `update` function first checks if the `doForceUpdate` option is set to `true`. If so, it updates the `dataSnapshot` state and triggers a rerender regardless of any other options. If `doForceUpdate` is `false`, it checks if `doObserveChanges` is `false`, in which case it returns without doing anything.

If `selector` is defined and `ignoredSelectors` is also defined, the function checks if the selector matches any of the patterns in the `ignoredSelectors` array. If so, it returns without doing anything. If `selector` is defined and `observedSelectors` is defined, it checks if the selector matches any of the patterns in the `observedSelectors` array. If not, it returns without doing anything.

Finally, if `doUpdateOnlyWhenDataChanges` is `true`, the function compares the current `dataSnapshot` state with the new data snapshot obtained using `getDataSnapshot()`. If they are equal, it returns without doing anything. Otherwise, it updates the `dataSnapshot` state with a deep clone of the new data snapshot obtained using `cloneDeep()` from the Lodash library, and triggers a rerender using the `forceRerender` function obtained from the `useForceRerender` hook.

# Selectors

The `selector` argument in the `update` function is a string that specifies the property path to update in the data snapshot. The property path uses dot notation, where each dot separates nested objects or arrays. For example, a selector of `"person.name"` would update the `name` property of the `person` object.

The `observedSelectors` and `ignoredSelectors` arguments are arrays of strings that allow selective updates based on the property path. Each string in the arrays is a pattern that can contain two types of wildcards:

- `*` matches any one word in the property path
- `**` matches the rest of the following path

`.` is a word separator

For example, an `observedSelectors` array of `["person.*"]` would observe changes to any property under the `person` object, while an `ignoredSelectors` array of `["person.age"]` would ignore changes to the `age` property of the `person` object.

There can be more variants such as: `"person.*.*"`, `"person.*.color"`, `"person.**"`, etc.

These selectors can be used to optimize updates to specific parts of the data snapshot, reducing the number of unnecessary re-renders in React components. For example, if a component only displays a subset of the data, the `observedSelectors` array can be used to observe changes only to the relevant parts of the data. Similarly, the `ignoredSelectors` array can be used to ignore changes to parts of the data that are not displayed in the component.

Overall, these selector arrays allow for fine-grained control over which parts of the data snapshot trigger updates and which do not.
