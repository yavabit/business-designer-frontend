import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
    id: string;
    firstname: string | undefined;
    lastname: string | undefined;
    name: string;
    email: string;
    pict_url: string | undefined;
    token: string;
    isAuth: boolean;
    isLoading: boolean;
    projects_count: number;
}

const initialState: InitialState = {
    id: "",
    firstname: "",
    lastname: "",
    name: "",
    email: "",
    pict_url: "",
    token: "",
    isAuth: false,
    isLoading: true,
    projects_count: 0,
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

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setProfile(state, action: PayloadAction<Omit<IUser, "isAuth"> & {projects_count: number}>) {
            state.id = action.payload.id;
            state.firstname = action.payload.firstname;
            state.lastname = action.payload.lastname;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.pict_url = action.payload.pict_url;
            state.projects_count = action.payload.projects_count
        },

        setCredentials(
            state,
            action: PayloadAction<{ accessToken: string; id: string, email: string }>
        ) {
            state.id = action.payload.id;
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
export const { setAuth, setLoading, setName, setEmail, setProfile, setCredentials, reset } =
    userSlice.actions;
