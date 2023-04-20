import { ReactNode } from "react";
import { createStore } from "./createStore";

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
