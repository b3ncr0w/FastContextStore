import { ReactNode } from "react";
import { createStore } from "./createStore";

// * If you know the data before runtime, you can set it here
// * Otherwise set it in the DataWrapper.tsx and leave the createStore() without arguments

export const [Provider, useStore] = createStore({
  array1: ["el1", "el2", "el3"],
  data1: "data1",
  data2: {
    data1: "data2-1",
  },
  data3: {
    data1: "data3-1",
    data2: {
      data1: "data3-2-1",
    },
  },
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return <Provider>{children}</Provider>;
};
