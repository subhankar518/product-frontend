import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
    user: null,
    role: null,
    accessToken: null,
    isAuthenticated: false,
    status: "idle",
    error: null,
};

export const loginThunk = createAsyncThunk(
    "auth/login",
    async (payload, thunkAPI) => {
        try {
            const { data } = await api.post("/users/login", payload);
            return data?.data || data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

export const registerThunk = createAsyncThunk(
    "auth/register",
    async (payload, thunkAPI) => {
        try {
            const { data } = await api.post("/users/register", payload);
            return data?.data || data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
    try {
        await api.post("/users/logout");
    } catch {}
    return true;
});

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken(state, action) {
            state.accessToken = action.payload;
            state.isAuthenticated = !!action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                const { user, accessToken } = action.payload || {};
                state.user = user;
                state.role = user?.role || "user";
                state.accessToken = accessToken;
                state.isAuthenticated = true;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Login failed";
            })
            .addCase(registerThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(registerThunk.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Register failed";
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.user = null;
                state.role = null;
                state.accessToken = null;
                state.isAuthenticated = false;
            });
    },
});

export const { setAccessToken } = slice.actions;
export const logout = () => ({ type: logoutThunk.fulfilled.type });
export default slice.reducer;
