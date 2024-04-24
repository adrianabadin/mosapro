"use client";
import {  configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { apiSlice } from "./Features/apiSlice";



export const storeX = configureStore({
    reducer:{
       [apiSlice.reducerPath]:apiSlice.reducer,
    },
    middleware:(buildGetDefaultMiddleware)=>buildGetDefaultMiddleware({
        thunk: true,
        immutableCheck: true,
        serializableCheck: false,
        actionCreatorCheck: true
    }).concat(apiSlice.middleware)
})
export type RootState = ReturnType<typeof storeX.getState>
export type AppDispatch = ReturnType<typeof storeX.dispatch>
export const useAppSelector:TypedUseSelectorHook<RootState>=useSelector