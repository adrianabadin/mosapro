"use client";
import { Provider } from "react-redux";
import { storeX } from "./store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={storeX}>{children}</Provider>;
}
