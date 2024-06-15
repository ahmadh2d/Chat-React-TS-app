import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatReducer, {changeBlock, changeChat} from './slices/chatSlice';
import { userService } from "./services/user";
import { setupListeners } from "@reduxjs/toolkit/query/react";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        [userService.reducerPath]: userService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(userService.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export const { useObserveAuthStateQuery } = userService;
export * from './thunks/fetchUserData';
export {changeChat, changeBlock};