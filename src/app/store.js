import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authentication/auth'

export const store = configureStore({
    reducer: {
        auth: authReducer,
    }
})