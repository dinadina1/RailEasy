import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import { persistReducer, persistStore } from "redux-persist";
// import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import stationReducer from "./slices/stationSlice";
import trainReducer from "./slices/trainSlice";
import bookingReducer from "./slices/bookingSlice";
import { thunk } from "redux-thunk";

// const persistConfig = {
//   key: "root",
//   storage,
// };

// Create reducers
const rootReducer = combineReducers({
  authState: authReducer,
  stationState: stationReducer,
  trainState: trainReducer,
  bookingState: bookingReducer,
});

// Persist reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  // getDefaultMiddleware({
  //   serializableCheck: {
  //     ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
  //   },
  // }),
});

// Persistor
// const persistor = persistStore(store);

// Export store and persistor
export default store;
