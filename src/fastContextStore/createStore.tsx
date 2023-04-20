import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import {
  subscribeDataSnapshot,
  getDataWithSelector,
  setDataWithSelector,
} from "./storeUtils";
import { useStoreCore } from "./useStoreCore";
import { SettingsType } from "./@types.store";

export function createStore<T = any>(initData?: T) {
  const StoreContext = createContext<ReturnType<typeof useStoreCore<T>> | null>(
    null
  );
  let isInitialized: boolean = false;

  const StoreProvider = ({ children }: { children: ReactNode }) => {
    const store = useStoreCore<T>(initData);
    const isStoreInitialized = useRef(false);

    useEffect(() => {
      if (!isStoreInitialized.current) {
        isStoreInitialized.current = true;
        store.notify({ settings: { doForceUpdate: true } });
        isInitialized = true;
      }
    }, [isStoreInitialized]);

    return (
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
  };

  function useStore() {
    const store = useContext(StoreContext)!;
    if (!store) throw new Error("Store not found");

    function getStoreData<T = any>(selector?: string, settings?: SettingsType) {
      return subscribeDataSnapshot({
        subscribe: (update) => store.subscribe(update, settings),
        getDataSnapshot: () => getDataWithSelector(store.get(), selector),
      }) as T;
    }

    function setStoreData<T = any>(
      value: ((prev: T) => T) | T,
      selector?: string,
      { doNotifyObservers = true }: { doNotifyObservers?: boolean } = {}
    ) {
      if (selector && !isInitialized) return;

      const prevData: T = getDataWithSelector(store.get(), selector);
      const data = setDataWithSelector(
        store.get(),
        typeof value === "function"
          ? (value as (prev: T) => T)(prevData)
          : value,
        selector
      );
      store.set(data);
      doNotifyObservers && store.notify({ selector });
    }

    function updateWithSelector(selector: string) {
      store.notify({ selector, settings: { doForceUpdate: true } });
    }

    return {
      getStoreData,
      setStoreData,
      updateWithSelector,
    };
  }

  return [StoreProvider, useStore] as const;
}
