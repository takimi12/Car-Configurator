import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

export interface Part {
  _id: string;
  id: string;
  name: string;
  price: number;
  partId: string;
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
      const exists = state.parts.some(
        (part) =>
          part._id === action.payload._id || part.id === action.payload.id,
      );
      if (!exists) {
        state.parts.push(action.payload);
      }
    },
    removePart: (state, action: PayloadAction<string>) => {
      state.parts = state.parts.filter((part) => {
        const partMongoId = part._id;
        const partCustomId = part.id;
        return (
          partMongoId !== action.payload && partCustomId !== action.payload
        );
      });
    },
    clearParts: (state) => {
      state.parts = [];
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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export const {
  increment,
  decrement,
  setParts,
  addPart,
  removePart,
  clearParts,
} = exampleSlice.actions;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
