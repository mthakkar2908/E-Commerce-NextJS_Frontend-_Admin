import type { Store } from "@reduxjs/toolkit";

let _store: Store;

export const setStore = (store: Store) => {
  _store = store;
};

export const getStore = () => _store;
