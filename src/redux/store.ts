import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Part {
  id: string;
  name: string;
  price: number;
  categoryId: string;
}

interface ExampleState {
  value: number;
  parts: Part[];
}

export const exampleSlice = createSlice({
  name: "example",
  initialState: {
    value: 0,
    parts: [],
  } as ExampleState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    setParts: (state, action: PayloadAction<Part[]>) => {
      state.parts = action.payload;
    },
    addPart: (state, action: PayloadAction<Part>) => {
      state.parts.push(action.payload);
    },
    removePart: (state, action: PayloadAction<string>) => {
      state.parts = state.parts.filter((part) => part.id !== action.payload);
    },
  },
});

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  example: exampleSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export const { increment, decrement, setParts, addPart, removePart } =
  exampleSlice.actions;

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer>;
