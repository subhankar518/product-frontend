import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    role: localStorage.getItem("role") || null,
    accessToken: localStorage.getItem("accessToken") || null,
    isAuthenticated: !!localStorage.getItem("accessToken"),
    status: "idle",
    error: null,
};

// login api
export const loginThunk = createAsyncThunk(
    "auth/login",
    async (payload, thunkAPI) => {
        try {
            const { data } = await api.post("/api/v1/users/login", payload);
            return data?.data || data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

// register api
export const registerThunk = createAsyncThunk(
    "auth/register",
    async (payload, thunkAPI) => {
        try {
            const { data } = await api.post("/api/v1/users/register", payload);
            return data?.data || data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

// logout api
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
    try {
        await api.post("/api/v1/users/logout");
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
            if (action.payload) {
                localStorage.setItem("accessToken", action.payload);
            } else {
                localStorage.removeItem("accessToken");
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // login
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

                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("role", user?.role || "user");
                localStorage.setItem("accessToken", accessToken);
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Login failed";
            })

            // register
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

            // logout
            .addCase(logoutThunk.fulfilled, (state) => {
                state.user = null;
                state.role = null;
                state.accessToken = null;
                state.isAuthenticated = false;

                localStorage.removeItem("user");
                localStorage.removeItem("role");
                localStorage.removeItem("accessToken");
            });
    },
});

export const { setAccessToken } = slice.actions;

export const logout = () => ({ type: logoutThunk.fulfilled.type });

export default slice.reducer;
