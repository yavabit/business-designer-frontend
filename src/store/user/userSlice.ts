import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
    firstname: string | undefined;
    lastname: string | undefined;
    name: string;
    email: string;
    pict_url: string | undefined;
    token: string;
    isAuth: boolean;
}

const initialState: InitialState = {
    firstname: "",
    lastname: "",
    name: "",
    email: "",
    pict_url: "",
    token: "",
    isAuth: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAuth: (state, { payload }) => {
            state.isAuth = payload;
        },
        setName: (state, { payload }) => {
            state.name = payload;
        },
        setEmail: (state, { payload }) => {
            state.email = payload;
        },

        setProfile(state, action: PayloadAction<Omit<IUser, "id" | "isAuth">>) {
            state.firstname = action.payload.firstname;
            state.lastname = action.payload.lastname;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.pict_url = action.payload.pict_url;
        },

        setCredentials(
            state,
            action: PayloadAction<{ accessToken: string; email: string }>
        ) {
            state.email = action.payload.email;
            state.token = action.payload.accessToken;
            if (action.payload.accessToken) {
                state.isAuth = true
            }
        },

        reset: () => initialState,
    },
});

export const userReducer = userSlice.reducer;
export const { setAuth, setName, setEmail, setProfile, setCredentials, reset } =
    userSlice.actions;
