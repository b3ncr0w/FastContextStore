import { ReactNode } from "react";
import { createStore } from "./createStore";

export const [Provider, useStore] = createStore();

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return <Provider>{children}</Provider>;
};
